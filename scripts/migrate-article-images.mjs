/**
 * Move a post's article images from the legacy B2 layout
 *   public/images/article/<random>.<ext>
 * to the content-addressed layout
 *   blog/<post-year>/<post-month>/<md5>.<ext>
 * and rewrite the Markdown to point at the new URLs.
 *
 * One post at a time, so each run is a small reviewable diff:
 *
 *   export B2_KEY_ID=...  B2_APPLICATION_KEY=...
 *   node scripts/migrate-article-images.mjs src/content/blog/article/2024_japan_travel_with_myself.md
 *   node scripts/migrate-article-images.mjs --dry-run src/content/blog/journal/random_050.md
 *
 * - Old objects are never deleted (run a GC pass once every post is migrated).
 * - Idempotent: URLs already under blog/ are ignored; re-running is a no-op.
 * - The rehype build plugin rewrites both old and new URLs, so migration has no
 *   functional effect on the rendered site — it only tidies the bucket.
 */

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const BUCKET = "sakanano";
const CDN = "https://img.sakanano.moe/file/sakanano";
const LEGACY_RE =
  /https:\/\/img\.sakanano\.moe\/file\/sakanano\/((?:sakanano\/)?public\/images\/article\/[^\s)"'<>]+)/g;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const files = args.filter(a => !a.startsWith("--"));

if (files.length === 0) {
  console.error("usage: migrate-article-images.mjs [--dry-run] <post.md> [post.md ...]");
  process.exit(1);
}

function postMonth(markdown) {
  const m = /^pubDatetime:\s*(\d{4})-(\d{2})-\d{2}/m.exec(markdown);
  if (!m) throw new Error("no pubDatetime in frontmatter");
  return { year: m[1], month: m[2] };
}

let b2 = null;
async function authorize() {
  if (b2) return b2;
  const id = process.env.B2_KEY_ID;
  const key = process.env.B2_APPLICATION_KEY;
  if (!id || !key) throw new Error("set B2_KEY_ID and B2_APPLICATION_KEY");
  const res = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    { headers: { Authorization: `Basic ${Buffer.from(`${id}:${key}`).toString("base64")}` } }
  );
  if (!res.ok) throw new Error(`b2_authorize_account: ${res.status}`);
  const data = await res.json();
  const api = data.apiInfo.storageApi;
  let bucketId = data.allowed?.bucketId;
  if (!bucketId) {
    const lb = await fetch(`${api.apiUrl}/b2api/v3/b2_list_buckets`, {
      method: "POST",
      headers: { Authorization: data.authorizationToken, "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: data.accountId, bucketName: BUCKET }),
    });
    bucketId = (await lb.json()).buckets[0].bucketId;
  }
  b2 = { apiUrl: api.apiUrl, token: data.authorizationToken, bucketId };
  return b2;
}

async function exists(key) {
  const res = await fetch(`${CDN}/${key}`, { method: "HEAD" });
  return res.ok;
}

async function upload(key, body, contentType) {
  const { apiUrl, token, bucketId } = await authorize();
  const gu = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ bucketId }),
  });
  if (!gu.ok) throw new Error(`b2_get_upload_url: ${gu.status}`);
  const { uploadUrl, authorizationToken } = await gu.json();
  const sha1 = createHash("sha1").update(body).digest("hex");
  const up = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: authorizationToken,
      "X-Bz-File-Name": encodeURIComponent(key),
      "Content-Type": contentType || "b2/x-auto",
      "Content-Length": String(body.length),
      "X-Bz-Content-Sha1": sha1,
    },
    body,
  });
  if (!up.ok) throw new Error(`b2_upload_file ${key}: ${up.status} ${await up.text()}`);
}

for (const file of files) {
  const markdown = await readFile(file, "utf8");
  const { year, month } = postMonth(markdown);
  const seen = new Map(); // oldUrl -> newUrl

  for (const [oldUrl, oldKey] of [...markdown.matchAll(LEGACY_RE)].map(m => [m[0], m[1]])) {
    if (seen.has(oldUrl)) continue;
    const ext = (oldKey.split(".").pop() || "").toLowerCase();
    const srcUrl = `${CDN}/${oldKey}`;
    const res = await fetch(srcUrl);
    if (!res.ok) {
      console.warn(`  skip (source ${res.status}): ${oldKey}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const md5 = createHash("md5").update(buf).digest("hex");
    const newKey = `blog/${year}/${month}/${md5}.${ext}`;
    const newUrl = `${CDN}/${newKey}`;
    seen.set(oldUrl, newUrl);

    if (dryRun) {
      console.log(`  [dry] ${oldKey}  ->  ${newKey}  (${buf.length} B)`);
      continue;
    }
    if (await exists(newKey)) {
      console.log(`  exists ${newKey}`);
    } else {
      await upload(newKey, buf, res.headers.get("content-type"));
      console.log(`  uploaded ${newKey} (${buf.length} B)`);
    }
  }

  if (!dryRun && seen.size) {
    let out = markdown;
    for (const [oldUrl, newUrl] of seen) out = out.split(oldUrl).join(newUrl);
    await writeFile(file, out);
  }
  console.log(`${file}: ${seen.size} image(s) ${dryRun ? "to migrate" : "migrated"}`);
}

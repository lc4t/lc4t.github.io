#!/usr/bin/env node

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const DEFAULTS = Object.freeze({
  source: "src/assets/images/sky",
  objectPrefix: "public/images/sky",
  bucketName: "sakanano",
  cdnBaseUrl: "https://img.sakanano.moe/file/sakanano",
  cdnCnameTarget: "f005.backblazeb2.com",
  concurrency: 3,
  manifest: "b2-upload-manifest.json",
});

const SUPPORTED_CONTENT_TYPES = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

async function loadLocalEnvironment() {
  const environmentPath = path.join(PROJECT_ROOT, ".env.b2.local");
  let contents;
  try {
    const environmentStats = await stat(environmentPath);
    if (process.platform !== "win32" && (environmentStats.mode & 0o077) !== 0) {
      throw new Error(
        ".env.b2.local must only be readable and writable by its owner (chmod 600)"
      );
    }
    contents = await readFile(environmentPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const [lineNumber, rawLine] of contents.split(/\r?\n/).entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator <= 0) {
      throw new Error(
        `Invalid .env.b2.local entry on line ${lineNumber + 1}`
      );
    }
    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (!/^[A-Z][A-Z0-9_]*$/.test(name)) {
      throw new Error(
        `Invalid .env.b2.local variable on line ${lineNumber + 1}`
      );
    }
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    process.env[name] ??= value;
  }
}

export function normalizeObjectPrefix(value) {
  const normalized = value.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
  if (!normalized || normalized.split("/").some(part => part === "..")) {
    throw new Error(`Invalid B2 object prefix: ${value}`);
  }
  return normalized;
}

export function encodeB2FileName(fileName) {
  return fileName
    .split("/")
    .map(part => encodeURIComponent(part))
    .join("/");
}

export function validateCdnMapping({
  bucketName,
  cdnBaseUrl,
  cdnCnameTarget,
  b2DownloadUrl,
}) {
  const cdnUrl = new URL(cdnBaseUrl);
  if (cdnUrl.protocol !== "https:") {
    throw new Error("B2 CDN base URL must use HTTPS");
  }

  const expectedPath = `/file/${bucketName}`;
  const actualPath = cdnUrl.pathname.replace(/\/$/, "");
  if (actualPath !== expectedPath) {
    throw new Error(
      `CDN path must be ${expectedPath}; received ${actualPath || "/"}`
    );
  }

  if (b2DownloadUrl && cdnCnameTarget) {
    const actualB2Host = new URL(b2DownloadUrl).hostname;
    if (actualB2Host !== cdnCnameTarget) {
      throw new Error(
        `CDN CNAME target mismatch: configured ${cdnCnameTarget}, B2 returned ${actualB2Host}`
      );
    }
  }

  return cdnUrl.toString().replace(/\/$/, "");
}

export function buildCdnUrl(cdnBaseUrl, objectKey) {
  return `${cdnBaseUrl.replace(/\/$/, "")}/${encodeB2FileName(objectKey)}`;
}

function parseArguments(argv) {
  const options = {
    upload: false,
    overwrite: false,
    allowUnchecked: false,
    verifyCdn: true,
    source: DEFAULTS.source,
    objectPrefix: DEFAULTS.objectPrefix,
    concurrency: DEFAULTS.concurrency,
    manifest: DEFAULTS.manifest,
  };

  const takeValue = (argument, index) => {
    const inlineValue = argument.includes("=")
      ? argument.slice(argument.indexOf("=") + 1)
      : undefined;
    if (inlineValue !== undefined) return [inlineValue, index];
    if (!argv[index + 1] || argv[index + 1].startsWith("--")) {
      throw new Error(`Missing value for ${argument}`);
    }
    return [argv[index + 1], index + 1];
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--upload") options.upload = true;
    else if (argument === "--overwrite") options.overwrite = true;
    else if (argument === "--allow-unchecked") options.allowUnchecked = true;
    else if (argument === "--no-verify-cdn") options.verifyCdn = false;
    else if (argument === "--help" || argument === "-h") options.help = true;
    else if (argument.startsWith("--source")) {
      [options.source, index] = takeValue(argument, index);
    } else if (argument.startsWith("--prefix")) {
      [options.objectPrefix, index] = takeValue(argument, index);
    } else if (argument.startsWith("--concurrency")) {
      const [value, nextIndex] = takeValue(argument, index);
      options.concurrency = Number.parseInt(value, 10);
      index = nextIndex;
    } else if (argument.startsWith("--manifest")) {
      [options.manifest, index] = takeValue(argument, index);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (
    !Number.isInteger(options.concurrency) ||
    options.concurrency < 1 ||
    options.concurrency > 8
  ) {
    throw new Error("--concurrency must be an integer between 1 and 8");
  }
  options.objectPrefix = normalizeObjectPrefix(options.objectPrefix);
  return options;
}

function printHelp() {
  console.log(`B2 asset uploader for lc4t.github.io

Usage:
  yarn assets:plan
  yarn assets:upload

Options:
  --upload              Upload files (without this flag, only show the plan)
  --overwrite           Upload a new version when an object exists with different content
  --allow-unchecked     Upload without listFiles permission (may create duplicate versions)
  --source PATH         Local directory (default: ${DEFAULTS.source})
  --prefix PREFIX       B2 object prefix (default: ${DEFAULTS.objectPrefix})
  --concurrency NUMBER  Parallel upload workers, 1-8 (default: ${DEFAULTS.concurrency})
  --manifest PATH       Upload report (default: ${DEFAULTS.manifest})
  --no-verify-cdn       Skip public CDN HEAD checks after upload
  --help                Show this message

Required only with --upload:
  B2_KEY_ID
  B2_APPLICATION_KEY

Optional overrides:
  B2_BUCKET_NAME        default: ${DEFAULTS.bucketName}
  B2_BUCKET_ID          needed only if a restricted key does not reveal its bucket
  B2_CDN_ORIGIN         default: ${DEFAULTS.cdnBaseUrl}
  B2_CDN_CNAME          default: ${DEFAULTS.cdnCnameTarget}`);
}

function resolveInsideProject(relativeOrAbsolutePath, label) {
  const resolved = path.resolve(PROJECT_ROOT, relativeOrAbsolutePath);
  const relative = path.relative(PROJECT_ROOT, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} must stay inside the repository: ${resolved}`);
  }
  return resolved;
}

async function collectAssetFiles(sourceDirectory) {
  const sourceStats = await stat(sourceDirectory);
  if (!sourceStats.isDirectory()) {
    throw new Error(`Asset source is not a directory: ${sourceDirectory}`);
  }

  const assets = [];
  const visit = async directory => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`Symbolic links are not uploaded: ${absolutePath}`);
      }
      if (entry.isDirectory()) await visit(absolutePath);
      else if (entry.isFile()) {
        const extension = path.extname(entry.name).toLocaleLowerCase();
        const contentType =
          SUPPORTED_CONTENT_TYPES.get(extension) ??
          (entry.name.endsWith("_license")
            ? "text/plain; charset=utf-8"
            : undefined);
        if (!contentType) continue;
        const fileStats = await lstat(absolutePath);
        assets.push({ absolutePath, contentType, size: fileStats.size });
      }
    }
  };

  await visit(sourceDirectory);
  return assets.sort((left, right) =>
    left.absolutePath.localeCompare(right.absolutePath)
  );
}

async function sha1File(filePath) {
  const hash = createHash("sha1");
  await new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("data", chunk => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", resolve);
  });
  return hash.digest("hex");
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = units[0];
  for (let index = 1; index < units.length && value >= 1024; index += 1) {
    value /= 1024;
    unit = units[index];
  }
  return `${value.toFixed(unit === "B" ? 0 : 1)} ${unit}`;
}

async function parseJsonResponse(response, operation) {
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { message: text.slice(0, 300) };
  }

  if (!response.ok) {
    const error = new Error(
      `${operation} failed (${response.status}${body.code ? ` ${body.code}` : ""}): ${body.message || response.statusText}`
    );
    error.status = response.status;
    error.code = body.code;
    error.retryAfter = response.headers.get("retry-after");
    throw error;
  }
  return body;
}

async function authorizeAccount(keyId, applicationKey) {
  const credentials = Buffer.from(`${keyId}:${applicationKey}`).toString(
    "base64"
  );
  const response = await fetch(
    "https://api.backblazeb2.com/b2api/v4/b2_authorize_account",
    { headers: { Authorization: `Basic ${credentials}` } }
  );
  return parseJsonResponse(response, "b2_authorize_account");
}

async function b2JsonRequest(url, authorizationToken, body, operation) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return parseJsonResponse(response, operation);
}

async function resolveBucket(auth, bucketName, configuredBucketId) {
  const storageApi = auth.apiInfo?.storageApi;
  if (!storageApi) throw new Error("The application key has no B2 Storage API access");

  const allowedBuckets = storageApi.allowed?.buckets ?? [];
  const allowedMatch = allowedBuckets.find(bucket => bucket.name === bucketName);
  if (allowedMatch) return allowedMatch.id;

  // A key restricted to exactly one bucket may hide the bucket name when it
  // lacks listAllBucketNames. The single allowed ID is still unambiguous.
  if (allowedBuckets.length === 1 && allowedBuckets[0].id) {
    return allowedBuckets[0].id;
  }

  if (
    configuredBucketId &&
    (allowedBuckets.length === 0 ||
      allowedBuckets.some(bucket => bucket.id === configuredBucketId))
  ) {
    return configuredBucketId;
  }

  const capabilities = storageApi.allowed?.capabilities ?? [];
  if (!capabilities.includes("listBuckets")) {
    throw new Error(
      `Cannot resolve bucket ${bucketName}. Set B2_BUCKET_ID or grant listBuckets to this key.`
    );
  }

  const result = await b2JsonRequest(
    `${storageApi.apiUrl}/b2api/v4/b2_list_buckets`,
    auth.authorizationToken,
    { accountId: auth.accountId, bucketName },
    "b2_list_buckets"
  );
  const bucket = result.buckets?.find(item => item.bucketName === bucketName);
  if (!bucket) throw new Error(`B2 bucket not found: ${bucketName}`);
  return bucket.bucketId;
}

function assertUploadAccess(storageApi, objectPrefix) {
  const capabilities = storageApi.allowed?.capabilities ?? [];
  if (!capabilities.includes("writeFiles")) {
    throw new Error("The B2 application key does not have writeFiles capability");
  }
  const allowedPrefix = storageApi.allowed?.namePrefix;
  if (allowedPrefix && !`${objectPrefix}/`.startsWith(allowedPrefix)) {
    throw new Error(
      `The B2 key is restricted to ${allowedPrefix}, which does not allow ${objectPrefix}/`
    );
  }
  return capabilities;
}

async function listRemoteFiles(auth, bucketId, objectPrefix) {
  const storageApi = auth.apiInfo.storageApi;
  const files = new Map();
  let startFileName;
  do {
    const result = await b2JsonRequest(
      `${storageApi.apiUrl}/b2api/v4/b2_list_file_names`,
      auth.authorizationToken,
      {
        bucketId,
        prefix: `${objectPrefix}/`,
        startFileName,
        maxFileCount: 1000,
      },
      "b2_list_file_names"
    );
    for (const file of result.files ?? []) files.set(file.fileName, file);
    startFileName = result.nextFileName ?? undefined;
  } while (startFileName);
  return files;
}

async function getUploadTarget(auth, bucketId) {
  const storageApi = auth.apiInfo.storageApi;
  return b2JsonRequest(
    `${storageApi.apiUrl}/b2api/v4/b2_get_upload_url`,
    auth.authorizationToken,
    { bucketId },
    "b2_get_upload_url"
  );
}

export function isRetryableUploadError(error) {
  return (
    (error instanceof TypeError && error.message === "fetch failed") ||
    [408, 429, 500, 502, 503, 504].includes(error.status) ||
    ["bad_auth_token", "expired_auth_token", "service_unavailable"].includes(
      error.code
    )
  );
}

async function uploadFile(auth, bucketId, asset, onAttempt) {
  let uploadTarget;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      uploadTarget ??= await getUploadTarget(auth, bucketId);
      onAttempt?.(attempt);
      const body = await readFile(asset.absolutePath);
      const response = await fetch(uploadTarget.uploadUrl, {
        method: "POST",
        headers: {
          Authorization: uploadTarget.authorizationToken,
          "Content-Length": String(asset.size),
          "Content-Type": asset.contentType,
          "X-Bz-Content-Sha1": asset.sha1,
          "X-Bz-File-Name": encodeB2FileName(asset.objectKey),
        },
        body,
      });
      return await parseJsonResponse(response, `upload ${asset.objectKey}`);
    } catch (error) {
      if (attempt === 5 || !isRetryableUploadError(error)) throw error;
      uploadTarget = undefined;
      const retryAfter = Number.parseInt(error.retryAfter ?? "", 10);
      await sleep(Number.isFinite(retryAfter) ? retryAfter * 1000 : attempt * 500);
    }
  }
  throw new Error(`Upload retries exhausted: ${asset.objectKey}`);
}

async function runPool(items, concurrency, worker) {
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        await worker(items[index], index);
      }
    }
  );
  await Promise.all(workers);
}

async function verifyCdnAsset(asset) {
  try {
    const response = await fetch(asset.cdnUrl, {
      method: "HEAD",
      redirect: "follow",
    });
    const contentLength = Number.parseInt(
      response.headers.get("content-length") ?? "",
      10
    );
    return {
      ok:
        response.ok &&
        (!Number.isFinite(contentLength) || contentLength === asset.size),
      status: response.status,
      contentLength: Number.isFinite(contentLength) ? contentLength : null,
    };
  } catch (error) {
    return { ok: false, status: null, message: error.message };
  }
}

async function main() {
  await loadLocalEnvironment();
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const bucketName = process.env.B2_BUCKET_NAME ?? DEFAULTS.bucketName;
  const cdnBaseUrl = validateCdnMapping({
    bucketName,
    cdnBaseUrl:
      process.env.B2_CDN_ORIGIN ??
      process.env.B2_CDN_BASE_URL ??
      DEFAULTS.cdnBaseUrl,
  });
  const sourceDirectory = resolveInsideProject(options.source, "--source");
  const files = await collectAssetFiles(sourceDirectory);
  if (files.length === 0) {
    console.log(`No supported files found in ${options.source}; nothing to do.`);
    return;
  }

  const assets = files.map(file => {
    const relativePath = path
      .relative(sourceDirectory, file.absolutePath)
      .split(path.sep)
      .join("/");
    const objectKey = `${options.objectPrefix}/${relativePath}`;
    return {
      ...file,
      localPath: path.relative(PROJECT_ROOT, file.absolutePath),
      objectKey,
      cdnUrl: buildCdnUrl(cdnBaseUrl, objectKey),
    };
  });
  const totalBytes = assets.reduce((sum, asset) => sum + asset.size, 0);

  console.log(
    `${options.upload ? "Upload" : "Dry run"}: ${assets.length} files (${formatBytes(totalBytes)})`
  );
  console.log(`Local:  ${path.relative(PROJECT_ROOT, sourceDirectory)}/`);
  console.log(`B2:     b2://${bucketName}/${options.objectPrefix}/`);
  console.log(`CDN:    ${cdnBaseUrl}/${options.objectPrefix}/`);
  console.log(`Example: ${assets[0].localPath} -> ${assets[0].cdnUrl}`);

  if (!options.upload) {
    console.log("No network request or file change was made. Use --upload to continue.");
    return;
  }

  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY;
  if (!keyId || !applicationKey) {
    throw new Error(
      "Set B2_KEY_ID and B2_APPLICATION_KEY in the environment before uploading"
    );
  }

  console.log("Authorizing with Backblaze B2…");
  const auth = await authorizeAccount(keyId, applicationKey);
  const storageApi = auth.apiInfo.storageApi;
  const capabilities = assertUploadAccess(storageApi, options.objectPrefix);
  validateCdnMapping({
    bucketName,
    cdnBaseUrl,
    cdnCnameTarget:
      process.env.B2_CDN_CNAME ?? DEFAULTS.cdnCnameTarget,
    b2DownloadUrl: storageApi.downloadUrl,
  });
  const bucketId = await resolveBucket(
    auth,
    bucketName,
    process.env.B2_BUCKET_ID
  );

  console.log("Calculating SHA-1 checksums…");
  await runPool(assets, options.concurrency, async asset => {
    asset.sha1 = await sha1File(asset.absolutePath);
  });

  let remoteFiles = new Map();
  if (capabilities.includes("listFiles")) {
    console.log("Checking existing B2 objects…");
    remoteFiles = await listRemoteFiles(auth, bucketId, options.objectPrefix);
  } else {
    if (!options.allowUnchecked) {
      throw new Error(
        "The B2 key lacks listFiles. Grant it for safe SHA-1 deduplication, or explicitly use --allow-unchecked."
      );
    }
    console.warn(
      "Warning: this key lacks listFiles; existing objects cannot be compared and will receive new versions."
    );
  }

  for (const asset of assets) {
    const remote = remoteFiles.get(asset.objectKey);
    asset.action = remote
      ? remote.contentSha1 === asset.sha1
        ? "skip"
        : options.overwrite
          ? "upload-new-version"
          : "conflict"
      : "upload";
  }
  const conflicts = assets.filter(asset => asset.action === "conflict");
  if (conflicts.length > 0) {
    throw new Error(
      `${conflicts.length} B2 objects exist with different content. Review them or rerun with --overwrite. First conflict: ${conflicts[0].objectKey}`
    );
  }

  const pending = assets.filter(asset => asset.action !== "skip");
  console.log(
    `${assets.length - pending.length} unchanged, ${pending.length} to upload with ${options.concurrency} workers.`
  );
  let completed = 0;
  await runPool(pending, options.concurrency, async asset => {
    const result = await uploadFile(auth, bucketId, asset);
    asset.fileId = result.fileId;
    asset.uploadedAt = result.uploadTimestamp ?? Date.now();
    completed += 1;
    console.log(`[${completed}/${pending.length}] ${asset.objectKey}`);
  });

  if (options.verifyCdn) {
    console.log("Checking all CDN URLs…");
    await runPool(assets, Math.min(6, options.concurrency * 2), async asset => {
      asset.cdnVerification = await verifyCdnAsset(asset);
    });
  }

  const manifestPath = resolveInsideProject(options.manifest, "--manifest");
  const manifest = {
    generatedAt: new Date().toISOString(),
    bucketName,
    source: path.relative(PROJECT_ROOT, sourceDirectory),
    objectPrefix: options.objectPrefix,
    cdnBaseUrl,
    files: assets.map(asset => ({
      localPath: asset.localPath,
      objectKey: asset.objectKey,
      cdnUrl: asset.cdnUrl,
      contentType: asset.contentType,
      size: asset.size,
      sha1: asset.sha1,
      action: asset.action,
      fileId: asset.fileId ?? null,
      cdnVerification: asset.cdnVerification ?? null,
    })),
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, {
    mode: 0o600,
  });

  const failedVerifications = assets.filter(
    asset => !asset.cdnVerification?.ok
  );
  console.log(`Manifest: ${path.relative(PROJECT_ROOT, manifestPath)}`);
  if (failedVerifications.length > 0) {
    console.warn(
      `Upload succeeded, but ${failedVerifications.length} CDN checks did not pass yet. Cloudflare propagation may be delayed.`
    );
  } else {
    console.log("Upload complete; CDN mapping checks passed.");
  }
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch(error => {
    console.error(`B2 upload failed: ${error.message}`);
    process.exitCode = 1;
  });
}

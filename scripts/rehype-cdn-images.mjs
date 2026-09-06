/**
 * Build-time Markdown image treatment for article posts.
 *
 * 1. Group runs of 2+ consecutive image-only paragraphs into a single
 *    `<div class="img-row">`, so a sequence of tall portrait screenshots lays
 *    out side by side instead of stacking into a very tall column (keeps the
 *    page's vertical rhythm even). Works whether the Markdown images are on
 *    adjacent lines or separated by blank lines.
 *
 * 2. Rewrite <img> tags that point at the img.sakanano.moe CDN into responsive
 *    images served through Cloudflare Image Transformations (/cdn-cgi/image/).
 *    Article images are referenced in Markdown as absolute CDN URLs, so Astro's
 *    asset pipeline and jampack both skip them — they otherwise ship at full
 *    resolution with no WebP/AVIF and no srcset.
 *    Prerequisite: "Image Transformations" enabled on the Cloudflare zone that
 *    serves img.sakanano.moe. `onerror=redirect` makes every generated URL fall
 *    back to the untouched original if a transform fails or the feature is off.
 */

const CDN_HOST = "img.sakanano.moe";
const WIDTHS = [480, 960, 1440, 2000];
const DEFAULT_WIDTH = 1200;
const QUALITY = 80;
const SIZES = "(max-width: 768px) 100vw, 768px";

function transform(src, width) {
  const u = new URL(src);
  const opts = `width=${width},quality=${QUALITY},format=auto,fit=scale-down,onerror=redirect`;
  return `${u.origin}/cdn-cgi/image/${opts}${u.pathname}${u.search}`;
}

function isCdnImg(node) {
  if (node.type !== "element" || node.tagName !== "img") return false;
  const src = node.properties && node.properties.src;
  return (
    typeof src === "string" &&
    src.includes(`//${CDN_HOST}/`) &&
    !src.includes("/cdn-cgi/image/")
  );
}

function isBlankText(node) {
  return node.type === "text" && node.value.trim() === "";
}

/** A <p> whose only meaningful children are <img> elements. */
function imagesInParagraph(node) {
  if (node.type !== "element" || node.tagName !== "p") return null;
  const meaningful = node.children.filter(c => !isBlankText(c));
  if (meaningful.length === 0) return null;
  const allImg = meaningful.every(
    c => c.type === "element" && c.tagName === "img"
  );
  return allImg ? meaningful : null;
}

/** Merge runs of >=2 consecutive image-only paragraphs into one div.img-row. */
function groupImageRows(node) {
  if (!node || !Array.isArray(node.children)) return;

  const children = node.children;
  const out = [];
  let i = 0;

  while (i < children.length) {
    const startImgs = imagesInParagraph(children[i]);
    if (startImgs) {
      const collected = [];
      let j = i;
      while (j < children.length) {
        const imgs = imagesInParagraph(children[j]);
        if (imgs) {
          collected.push(...imgs);
          j++;
        } else if (isBlankText(children[j])) {
          j++;
        } else {
          break;
        }
      }
      if (collected.length >= 2) {
        out.push({
          type: "element",
          tagName: "div",
          properties: { className: ["img-row"] },
          children: collected,
        });
        i = j;
        continue;
      }
    }
    groupImageRows(children[i]);
    out.push(children[i]);
    i++;
  }

  node.children = out;
}

function walk(node, visit) {
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) {
    visit(child);
    walk(child, visit);
  }
}

export default function rehypeCdnImages() {
  return tree => {
    groupImageRows(tree);
    walk(tree, node => {
      if (!isCdnImg(node)) return;
      const src = node.properties.src;
      node.properties.src = transform(src, DEFAULT_WIDTH);
      node.properties.srcset = WIDTHS.map(w => `${transform(src, w)} ${w}w`).join(
        ", "
      );
      if (!node.properties.sizes) node.properties.sizes = SIZES;
      if (!node.properties.loading) node.properties.loading = "lazy";
      if (!node.properties.decoding) node.properties.decoding = "async";
    });
  };
}

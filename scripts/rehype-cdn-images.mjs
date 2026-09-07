/**
 * Build-time Markdown image treatment for article posts.
 *
 * 1. Per-image size hints via the Markdown title string:
 *      ![说明](url "w=360")        -> max-width: 360px
 *      ![说明](url "h=420")        -> max-height: 420px  (overrides the 55vh cap)
 *      ![说明](url "w=360 h=420")  -> both
 *      ![说明](url "full")         -> max-width: 100%     (bypass the default cap)
 *    Recognised tokens are stripped from the title; any remaining text stays as
 *    the tooltip. A `w=` hint also narrows the responsive `sizes` attribute so
 *    the browser fetches an appropriately small variant.
 *
 * 2. Group a run of exactly TWO consecutive image-only paragraphs into a single
 *    `<div class="img-row">` so a comparison pair sits side by side. Runs of 3+
 *    are left as individual (height-capped) images.
 *
 *    For a deliberate multi-image layout, write the wrapper by hand in Markdown
 *    (blank lines around it; images on one line or several):
 *      <div class="img-row">      flexible row, wraps, keeps each image's ratio
 *
 *      ![a](u1) ![b](u2) ![c](u3)
 *
 *      </div>
 *      <div class="img-grid cols-3">   even N-column grid; also cols-2 / cols-4
 *
 *      ![a](u1) ![b](u2) ![c](u3)
 *
 *      </div>
 *    Add `tight` or `loose` for gap. The plugin lifts the images out of the
 *    paragraph Markdown wraps them in, and they still get the CDN rewrite below.
 *
 * 3. Rewrite <img> tags pointing at img.sakanano.moe into responsive images
 *    served through Cloudflare Image Transformations (/cdn-cgi/image/). Article
 *    images are absolute CDN URLs in Markdown, so Astro's asset pipeline and
 *    jampack both skip them. `onerror=redirect` falls back to the untouched
 *    original if a transform fails or the feature is off.
 */

const CDN_HOST = "img.sakanano.moe";
const WIDTHS = [480, 960, 1440, 2000];
const DEFAULT_WIDTH = 1200;
const QUALITY = 80;
const SIZES = "(max-width: 768px) 100vw, 768px";
const ROW_SIZE = 2;

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

/** Meaningful <img> children of a <p>, or null if it holds anything else. */
function imagesInParagraph(node) {
  if (node.type !== "element" || node.tagName !== "p") return null;
  const meaningful = node.children.filter(c => !isBlankText(c));
  if (meaningful.length === 0) return null;
  const allImg = meaningful.every(
    c => c.type === "element" && c.tagName === "img"
  );
  return allImg ? meaningful : null;
}

/** Merge a run of consecutive image-only paragraphs holding exactly ROW_SIZE
 *  images into one <div class="img-row">; leave any other run untouched. */
function groupImageRows(node) {
  if (!node || !Array.isArray(node.children)) return;

  const children = node.children;
  const out = [];
  let i = 0;

  while (i < children.length) {
    if (!imagesInParagraph(children[i])) {
      groupImageRows(children[i]);
      out.push(children[i]);
      i++;
      continue;
    }

    // Extent of this run of image paragraphs (blank text nodes allowed between).
    let j = i;
    const imgs = [];
    while (j < children.length) {
      const found = imagesInParagraph(children[j]);
      if (found) {
        imgs.push(...found);
        j++;
      } else if (isBlankText(children[j])) {
        j++;
      } else {
        break;
      }
    }

    if (imgs.length === ROW_SIZE) {
      out.push({
        type: "element",
        tagName: "div",
        properties: { className: ["img-row"] },
        children: imgs,
      });
    } else {
      for (let k = i; k < j; k++) {
        groupImageRows(children[k]);
        out.push(children[k]);
      }
    }
    i = j;
  }

  node.children = out;
}

/** Parse "w=360 h=420 full" style hints out of a Markdown title string. */
function applySizeHint(node) {
  const title = node.properties && node.properties.title;
  if (typeof title !== "string" || !title.trim()) return;

  const styles = [];
  const leftover = [];
  for (const tok of title.trim().split(/\s+/)) {
    let m;
    if ((m = /^w=(\d{1,4})$/.exec(tok))) {
      styles.push(`max-width:${m[1]}px`);
      node.properties.sizes = `${m[1]}px`;
    } else if ((m = /^h=(\d{1,4})$/.exec(tok))) {
      styles.push(`max-height:${m[1]}px`);
    } else if (tok === "full") {
      styles.push("max-width:100%");
    } else {
      leftover.push(tok);
    }
  }
  if (styles.length === 0) return;

  const prev = node.properties.style ? `${node.properties.style};` : "";
  node.properties.style = prev + styles.join(";");
  if (leftover.length) node.properties.title = leftover.join(" ");
  else delete node.properties.title;
}

const LAYOUT_CLASSES = ["img-row", "img-grid"];

function classList(node) {
  const c = node.properties && node.properties.className;
  return Array.isArray(c) ? c : c ? [c] : [];
}

/** For a hand-written <div class="img-row|img-grid">, replace its subtree with
 *  the flat list of <img> descendants so they become direct grid/flex items. */
function flattenLayoutContainers(node) {
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) {
    if (
      child.type === "element" &&
      classList(child).some(c => LAYOUT_CLASSES.includes(c))
    ) {
      const imgs = [];
      const collect = n => {
        for (const c of n.children || []) {
          if (c.type === "element" && c.tagName === "img") imgs.push(c);
          else collect(c);
        }
      };
      collect(child);
      if (imgs.length) child.children = imgs;
    } else {
      flattenLayoutContainers(child);
    }
  }
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
    flattenLayoutContainers(tree);
    walk(tree, node => {
      if (node.type === "element" && node.tagName === "img") applySizeHint(node);
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

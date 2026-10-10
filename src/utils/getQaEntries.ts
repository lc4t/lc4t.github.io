import { getCollection } from "astro:content";

export default function getQaEntries() {
  // 本地可以单独预览一封草稿；生产构建始终只收录已发布的来信。
  const previewSlug = import.meta.env.DEV
    ? process.env.QA_PREVIEW_SLUG
    : undefined;

  return getCollection(
    "qa",
    ({ slug, data }) => !data.draft || slug === previewSlug
  );
}

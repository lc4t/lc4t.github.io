import dayjs from "dayjs";
import type { CollectionEntry } from "astro:content";

// export const getSortedPostsByYear = (
//   posts: MarkdownInstance<Record<string, any>>[]
// ) => {
//   posts.sort((a, b) =>
//     b.frontmatter.pubDatetime.localeCompare(a.frontmatter.pubDatetime)
//   );
//   const map: Record<string, MarkdownInstance<Record<string, any>>[]> = {};
//   for (const p of posts) {
//     let y = dayjs(p.frontmatter.pubDatetime).format("YYYY");
//     map[y] ? map[y].push(p) : (map[y] = [p]);
//   }
//   return map;
// };

export const getSortedPostsByYear = (posts: CollectionEntry<"blog">[]) => {
  posts.sort(
    (a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime()
  );
  const map: Record<string, CollectionEntry<"blog">[]> = {};
  for (const p of posts) {
    let y = dayjs(p.data.pubDatetime).format("YYYY");
    map[y] ? map[y].push(p) : (map[y] = [p]);
  }
  return map;
};

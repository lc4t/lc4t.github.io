import type { CollectionEntry } from "astro:content";
import dayjs from "dayjs";
export const getSortedPosts = (posts: CollectionEntry<"blog">[]) =>
  posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
        Math.floor(new Date(a.data.pubDatetime).getTime() / 1000)
    );
export default getSortedPosts;

export const getSortedPostsByYear = (posts: CollectionEntry<"blog">[]) => {
  const sortedPosts = getSortedPosts(posts);
  const map: Record<string, CollectionEntry<"blog">[]> = {};

  for (const p of sortedPosts) {
    const y = getPostDate(p.id).substring(0, 4);
    map[y] ? map[y].push(p) : (map[y] = [p]);
  }

  return map;
};

export const getPosts = async () => await getCollection("blog");

export const getPostDate = (id: string) =>
  id.split("/").pop()!.substring(0, 10);
export const formatDate = (date: string | Date, type: 0 | 1 | 2 = 0) => {
  switch (type) {
    case 0:
      return dayjs(date).format("MMM D, YYYY");
    case 1:
      return dayjs(date).format("MMM D");
    case 2:
      return dayjs(date).format("YYYY/MM");
  }
};

import dayjs from "dayjs";
import getSortedPosts from "@utils/getSortedPosts";
import { Debug } from "astro/components";
import type { CollectionEntry } from "astro:content";

export const getSortedPostsByYear = (posts: CollectionEntry<"blog">[]) => {
  const sortedPosts = getSortedPosts(posts);
  const map: Record<string, CollectionEntry<"blog">[]> = {};

  for (const p of sortedPosts) {
    const y = dayjs(p.data.pubDatetime)
      .format("YYYY-MM-DD HH:mm")
      .substring(0, 4);
    map[y] ? map[y].push(p) : (map[y] = [p]);
  }

  return map;
};

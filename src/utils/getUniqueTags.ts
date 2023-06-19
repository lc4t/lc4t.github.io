import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  let tags: string[] = [];
  // let tagsWithCount: { [key: string]: number } = {};
  const filteredPosts = posts.filter(({ data }) => !data.draft);

  filteredPosts.forEach(post => {
    tags = [...tags, ...post.data.tags]
      .map(tag => slugifyStr(tag))
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      );
  });
  // filteredPosts.forEach(post => {
  //   post.data.tags.forEach(tag => {
  //     const slugifiedTag = slugifyStr(tag);
  //     if (tagsWithCount[slugifiedTag]) {
  //       tagsWithCount[slugifiedTag] += 1;
  //     } else {
  //       tagsWithCount[slugifiedTag] = 1;
  //     }
  //   })
  // });
  // console.log(tagsWithCount);
  return tags;
};

export default getUniqueTags;

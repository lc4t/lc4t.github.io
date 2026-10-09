import { getCollection } from "astro:content";
import slugify from "@utils/slugify";

type SearchItemType = "journal" | "article" | "archive";

const TYPE_TO_PATH: Record<SearchItemType, string> = {
  journal: "journals",
  article: "posts",
  archive: "posts",
};

const getType = (id: string): SearchItemType => {
  if (id.startsWith("journal/")) return "journal";
  if (id.startsWith("archive/")) return "archive";
  return "article";
};

const toSearchableText = (markdown: string) =>
  markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export async function get() {
  const posts = await getCollection(
    "blog",
    ({ data, id }) => !data.draft && !id.startsWith("record/")
  );
  const items = posts
    .sort((a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime())
    .map(post => {
      const type = getType(post.id);
      return {
        title: post.data.title,
        description: post.data.description,
        date: formatDate(post.data.pubDatetime),
        url: `/${TYPE_TO_PATH[type]}/${slugify(post.data)}/`,
        content: toSearchableText(post.body),
      };
    });

  return {
    body: JSON.stringify(items),
  };
}

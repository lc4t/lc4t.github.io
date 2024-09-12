import rss, { RSSOptions } from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import slugify from "@utils/slugify";
import { SITE } from "@config";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

const folderToLinkPrefix = {
  article: "posts",
  journal: "journals",
  // 在这里添加其他文件夹的映射
  // 例如: 'notes': 'notes',
};

export async function get() {
  const allPosts = await getCollection(
    "blog",
    a =>
      (a.slug.startsWith("article/") || a.slug.startsWith("journal/")) &&
      !a.data.draft
  );
  const sortedPosts = allPosts
    .sort(
      (a, b) =>
        new Date(b.data.pubDatetime).getTime() -
        new Date(a.data.pubDatetime).getTime()
    )
    .slice(0, 50);

  console.log(
    `获取到的文章数量: ${allPosts.length}, 处理后的文章数量: ${sortedPosts.length}`
  );

  const rssOptions: RSSOptions = {
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    trailingSlash: false,
    items: sortedPosts.map(post => {
      // 使用 post.slug 来确定文件夹
      const slugParts = post.slug.split("/");
      const folder = slugParts[0];
      const linkPrefix = folderToLinkPrefix[folder] || folder;
      const slug = slugParts.slice(1).join("/");
      const link = `/${linkPrefix}/${slug}/`;

      console.log(`生成链接: ${link} (原始 slug: ${post.slug})`);

      return {
        link,
        title: post.data.title,
        description: post.data.description,
        pubDate: new Date(post.data.pubDatetime),
        content: sanitizeHtml(parser.render(post.body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
        // content: sanitizeHtml(post.compiledContent()),
      };
    }),
    customData: `
    <follow_challenge>
        <feedId>56969302790438912</feedId>
        <userId>44596774657862656</userId>
    </follow_challenge>
    `,
  };

  return rss(rssOptions);
}

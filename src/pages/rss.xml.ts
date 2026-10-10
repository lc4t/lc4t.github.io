import rss, { RSSOptions } from "@astrojs/rss";
import { getCollection } from "astro:content";
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

const sanitizeContent = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  });

const escapeText = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function get() {
  const [allPosts, letters] = await Promise.all([
    getCollection(
      "blog",
      a =>
        (a.slug.startsWith("article/") || a.slug.startsWith("journal/")) &&
        !a.data.draft
    ),
    getCollection("qa", ({ data }) => !data.draft),
  ]);

  const items = [
    ...allPosts.map(post => {
      // 使用 post.slug 来确定文件夹
      const slugParts = post.slug.split("/");
      const folder = slugParts[0];
      const linkPrefix = folderToLinkPrefix[folder] || folder;
      const slug = slugParts.slice(1).join("/");
      const link = `/${linkPrefix}/${slug}/`;

      return {
        link,
        title: post.data.title,
        description: post.data.description,
        pubDate: new Date(post.data.pubDatetime),
        content: sanitizeContent(parser.render(post.body)),
      };
    }),
    ...letters.map(entry => {
      const question = entry.data.question
        .split(/\n\s*\n/)
        .map(
          paragraph => `<p>${escapeText(paragraph).replace(/\n/g, "<br>")}</p>`
        )
        .join("");

      return {
        link: `/qa/${entry.slug}/`,
        title: entry.data.listTitle,
        description: entry.data.listDescription,
        pubDate: entry.data.pubDatetime,
        content: sanitizeContent(
          `<h2>来信</h2>${question}<h2>回复</h2>${parser.render(entry.body)}`
        ),
      };
    }),
  ]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 50);

  const rssOptions: RSSOptions = {
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    trailingSlash: false,
    items,
    customData: `
    <follow_challenge>
        <feedId>56969302790438912</feedId>
        <userId>44596774657862656</userId>
    </follow_challenge>
    `,
  };

  return rss(rssOptions);
}

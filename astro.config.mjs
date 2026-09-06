import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import UnoCSS from "unocss/astro";
import mdx from "@astrojs/mdx";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeCdnImages from "./scripts/rehype-cdn-images.mjs";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  trailingSlash: "always",
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      [
        remarkToc,
        { heading: "目录", maxDepth: 5, tight: true, className: "remark-toc" },
      ],
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    rehypePlugins: [rehypeAccessibleEmojis, rehypeCdnImages],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});

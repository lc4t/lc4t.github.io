import { z } from "astro:content";

export const blogSchema = z
  .object({
    author: z.string().optional(),
    pubDatetime: z.date(),
    title: z.string(),
    postSlug: z.string().optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    ogImage: z.string().optional(),
    description: z.string(),
    otherSource: z
      .array(
        z.object({ href: z.string(), plat: z.string(), badge: z.string() })
      )
      .optional(),
    badge: z.array(z.string()).optional(),
  })
  .strict();

export type BlogFrontmatter = z.infer<typeof blogSchema>;

// 读者信箱（QA）。一条问答一个 md，正文是我的回复。
// 注意：这里【故意】没有 email / contact 字段 —— 提问者的联系方式只进我的
// 收件箱，绝不进入内容仓库或构建产物。缺字段就是结构级的防线。
export const qaSchema = z
  .object({
    // 读者来信的问题原文（展示用），逐字照登。
    question: z.string(),
    // 展示用署名。anonymous 为 true 时忽略，统一显示「匿名读者」。
    askerName: z.string().optional(),
    // 署名可选带链接（比如问题能归因到对方的博客/主页）。
    // 只有 anonymous=false 且填了 askerName 时才生效。
    askerUrl: z.string().url().optional(),
    // 公开展示时是否匿名 —— 由我收录时决定（提问者投稿时表达的意愿）。
    anonymous: z.boolean().default(false),
    // 收录（发布）时间。
    pubDatetime: z.date(),
    // 原始来信时间，用于列表、详情展示和来信排序。
    letterDatetime: z.date(),
    tags: z.array(z.string()).default(["others"]),
    // 脱敏后的原始邮件主题，用于详情页标题、浏览器标签和 giscus 映射。
    title: z.string(),
    // 单独撰写的列表标题与简介，详情页保留邮件原题和原文。
    listTitle: z.string().max(40),
    listDescription: z.string(),
    draft: z.boolean().optional(),
  })
  .strict();

export type QaFrontmatter = z.infer<typeof qaSchema>;

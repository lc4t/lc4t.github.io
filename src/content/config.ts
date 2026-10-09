import { z, defineCollection, reference } from "astro:content";
import { blogSchema, qaSchema } from "./_schemas";

const blog = defineCollection({
  type: "content",
  schema: blogSchema,
});

// 读者信箱：独立 collection，不与 blog 的 .strict() schema 纠缠。
const qa = defineCollection({
  type: "content",
  schema: qaSchema,
});

// const blog = defineCollection({
//   schema: blogSchema,
// });

export const collections = { blog, qa };

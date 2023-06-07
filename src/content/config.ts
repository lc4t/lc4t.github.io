import { z, defineCollection, reference } from "astro:content";
import { blogSchema } from "./_schemas";

const blog = defineCollection({
  type: "content",
  schema: blogSchema,
});

// const blog = defineCollection({
//   schema: blogSchema,
// });

export const collections = { blog };

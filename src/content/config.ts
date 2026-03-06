// Content collections config (for future markdown content if needed)
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
};

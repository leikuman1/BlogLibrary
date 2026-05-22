import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const bookSection = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
});

const books = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/books' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['active', 'planned']).default('active'),
    order: z.number().default(100),
    coverImage: z.string().optional(),
    coverPrompt: z.string().optional(),
    sections: z.array(bookSection).default([]),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/chapters' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    book: z.string(),
    section: z.string(),
    order: z.number(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { books, chapters };

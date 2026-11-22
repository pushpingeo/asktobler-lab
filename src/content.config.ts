import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    kind: z.enum(["experiment", "essay", "field note"]),
    // Name of a map in src/maps (without .svg) to lead the piece.
    map: z.string().optional(),
    mapCaption: z.string().optional(),
    // Set for pieces first published on LinkedIn.
    linkedin: z.string().url().optional(),
    // Drafts build in development only.
    draft: z.boolean().default(false),
  }),
});

// Posts from the Spatial Miscellany (2007-2010), kept as written.
const archive = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/archive" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    original: z.string().url(), // Internet Archive copy of the original post
  }),
});

export const collections = { notes, archive };

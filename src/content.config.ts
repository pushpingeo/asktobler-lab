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
    // Drafts build in development only.
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };

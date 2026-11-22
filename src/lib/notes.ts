import { getCollection } from "astro:content";

/** Notes newest first. Drafts only show when running `npm run dev`. */
export async function getNotes() {
  const all = await getCollection("notes", ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

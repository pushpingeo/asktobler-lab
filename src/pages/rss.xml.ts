import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getNotes } from "../lib/notes";
import { SITE } from "../site.config";

export async function GET(context: APIContext) {
  const notes = await getNotes();
  return rss({
    title: `${SITE.name} notes`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: notes.map((n) => ({
      title: n.data.title,
      pubDate: n.data.date,
      description: n.data.summary,
      link: `/notes/${n.id}/`,
    })),
  });
}

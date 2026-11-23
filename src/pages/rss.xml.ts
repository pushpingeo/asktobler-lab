import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getNotes } from "../lib/notes";
import settings from "../content/settings/site.json";

export async function GET(context: APIContext) {
  const notes = await getNotes();
  return rss({
    title: `${settings.name} notes`,
    description: settings.description,
    site: context.site ?? "https://asktobler.ai",
    items: notes.map((n) => ({
      title: n.data.title,
      pubDate: n.data.date,
      description: n.data.summary,
      link: `/notes/${n.id}/`,
    })),
  });
}

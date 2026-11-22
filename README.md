# Tobler Lab (asktobler.ai)

Rob Dunfey's open lab: small, working experiments in what happens when AI becomes the interface to geography. Static site built with [Astro](https://astro.build), hosted on Cloudflare Pages.

## Writing a note

1. Add a markdown file to `src/content/notes/`, e.g. `my-note.md`. The file name becomes the address (`/notes/my-note`).
2. Front matter:
   ```yaml
   ---
   title: One question, three engines
   date: 2026-11-22
   summary: One or two sentences for lists, RSS and link previews.
   kind: experiment        # experiment, essay or field note
   map: engines            # optional: a map from src/maps to lead the piece
   mapCaption: Optional caption under the map.
   draft: false            # true = only shows when running locally
   ---
   ```
3. Open a pull request. Cloudflare builds a preview link for it. Check it on your phone, then merge to publish.

## Projects

Edit `src/data/projects.ts`. Each project has one point it makes, a status (Live, Building, Write-up coming), a map and links.

## Maps

The maps are SVGs drawn from real open data by `scripts/make_maps.py` (NSTA and Crown Estate layers from `pushpingeo/north-sea-geo-demo`, licence blocks from `pushpingeo/simops-radar`, coastline from Natural Earth). They're inlined into pages so they use the site's fonts and colours (`src/styles/maps.css`). Run the script's docstring command to redraw them.

## Settings

`src/site.config.ts` holds the name, tagline, links, and the `launched` switch. While `launched` is false, every page tells search engines not to index it and `robots.txt` blocks crawlers. The site is still public, just not promoted.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Hosting on Cloudflare Pages

1. Cloudflare dashboard: Workers & Pages, Create, Pages, Connect to Git, pick `pushpingeo/asktobler-lab`.
2. Framework preset: Astro. Build command `npm run build`, output directory `dist`.
3. Custom domains: add `asktobler.ai` (and `www.asktobler.ai` if you want it).
4. Optional: Web Analytics on the project, which is cookie-free.

Every pull request then gets its own preview URL.

# Tobler Lab (asktobler.ai)

Rob Dunfey's open lab: small, working experiments in what happens when AI becomes the interface to geography. Static site built with [Astro](https://astro.build), hosted on Cloudflare Pages.

## Editing the site

Every piece of text on the site can be edited in the browser with [TinaCMS](https://tina.io):

1. Go to **asktobler.ai/admin** and log in with your Tina Cloud account.
2. Pick a page, or just browse to it in the preview. Click any text on the page and the matching box opens on the left. The page updates as you type.
3. Click **Save**. Tina commits the change to GitHub, and Cloudflare rebuilds the site in a minute or two.

Notes and archive posts have an image button in the text editor. Uploaded pictures are stored in `public/images/`.

What's where, if you'd rather edit the files directly:

| What | File |
|---|---|
| Name, tagline, menu, footer, links, the `launched` switch | `src/content/settings/site.json` |
| Home, About, Projects, Notes, Archive and 404 page text | `src/content/pages/*.md` |
| Projects (one file each, `order` sets the order) | `src/content/projects/*.md` |
| Notes | `src/content/notes/*.md` |
| Earlier writing | `src/content/archive/*.md` |

The fields each file can have are defined in `tina/config.ts`. A new note needs a title, date, summary and kind; `draft: true` keeps it off the live site.

While `launched` is false, every page tells search engines not to index it and `robots.txt` blocks crawlers. The site is still public, just not promoted.

## Maps

The maps are SVGs drawn from real open data by `scripts/make_maps.py` (NSTA and Crown Estate layers from `pushpingeo/north-sea-geo-demo`, licence blocks from `pushpingeo/simops-radar`, coastline from Natural Earth). They're inlined into pages so they use the site's fonts and colours (`src/styles/maps.css`). Run the script's docstring command to redraw them.

## Run it locally

```bash
npm install
npm run dev          # site at http://localhost:4321, editor at http://localhost:4321/admin
npm run build:local  # build without Tina Cloud; output in dist/
```

Locally, Tina saves straight to the files on disk, with no login.

## Hosting on Cloudflare Workers

Pages are still static HTML, but Tina's live preview needs one small server route (`/tina-island`), so the site runs as a Cloudflare Worker rather than on Cloudflare Pages.

1. Cloudflare dashboard: Workers & Pages, Create, Import a repository, pick `pushpingeo/asktobler-lab`.
2. Build command `npm run build`. Deploy command `npx wrangler deploy -c dist/server/wrangler.json`.
3. Variables and secrets (for the build): `PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` from [app.tina.io](https://app.tina.io).
4. Settings, Domains & Routes: add `asktobler.ai`.

Branches other than `main` get their own preview address.

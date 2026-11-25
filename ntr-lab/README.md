# NTR lab: does a written skill make an AI agent better?

Moved here from `pushpingeo/tobler` on 25 November 2026. This is where Tobler started: an agent that screens a project site for environmental and social risk in IFC Performance Standard terms, and an evaluation of it against IFC's own decisions on 45 real projects. Tobler (asktobler.com) has since moved on; this is kept as it was, as a worked example.

The write-up is [`lab-writeup.md`](lab-writeup.md). Its links to pushpingeo.github.io/tobler are from the time it was written.

## What's here

| Path | What it is |
|---|---|
| `lab.html` | The agent, with the skill switchable on and off |
| `lab-results.html` | The evaluation results |
| `tools.html` | The spatial tools on their own, no AI |
| `js/agent.js`, `js/tools.js`, `js/rules.js` | The agent loop, the deterministic tools, and a rules-only reading of the skill |
| `js/claude.js`, `js/config.js` | How the pages call Claude (copies of Tobler's at the time of the move) |
| `skills/ntr-screening-ifc/` | The evaluated skill, frozen on 17 November |
| `catalogue/catalogue.json` | The concepts the tools look for in OpenStreetMap |
| `data/` | The 45 sites, the dev/test split, and the OpenStreetMap, GBIF and Wikidata snapshots the evaluation ran on |
| `eval/` | Every run's full trace and summary, and the rules-only baseline |
| `scripts/` | The evaluation runner, the snapshot fetcher, the rules baseline and the scorer |
| `test/` | Tests for the tools and the agent loop |
| `workflows/` | The two GitHub Actions workflows that ran the evaluation and the snapshots. Kept for reference and not active here: to run them, move them to `.github/workflows/`, add the `ANTHROPIC_API_KEY` secret, and set their working directory to `ntr-lab` |

None of this is part of the asktobler.ai site build; Astro only builds `src/` and `public/`.

## Run it

```bash
cd ntr-lab
npm install
npm test               # tools and agent loop, no API calls
npm run serve          # then http://localhost:8000/lab.html
```

The pages load MapLibre, Turf and osmtogeojson from public CDNs. The agent calls Claude through Tobler's Worker, or with a key you paste in.

Rescore without API calls: `node scripts/run-eval.mjs --label=v1 --arms=rules,off,on,web --repeats=2 --reparse`.

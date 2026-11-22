export type Project = {
  slug: string;
  title: string;
  point: string; // the one thing it shows
  body: string;
  status: "Live" | "Building" | "Write-up coming";
  map: string; // src/maps/<map>.svg
  links: { label: string; href: string }[];
  note?: string; // slug of the note that explains it
};

export const projects: Project[] = [
  {
    slug: "three-engines",
    title: "One question, three engines",
    point: "Once AI is the interface, the engine underneath is a choice, not a lock-in.",
    body:
      "Ask a question about North Sea energy data in plain English. Claude writes a precise spec, then implements it three times, in Turf.js, DuckDB and GeoPandas, all running in your browser. A compare view shows where they agree, and where they don't.",
    status: "Live",
    map: "engines",
    links: [
      { label: "Try it", href: "https://pushpingeo.github.io/north-sea-geo-demo/" },
      { label: "Code", href: "https://github.com/pushpingeo/north-sea-geo-demo" },
    ],
    note: "one-question-three-engines",
  },
  {
    slug: "simops-radar",
    title: "SIMOPS Radar",
    point: "Public consent data can warn operators before two jobs collide at sea.",
    body:
      "A seismic vessel costs around $250,000 a day and a rig around $500,000, so two operations clashing in the same patch of sea is expensive. SIMOPS Radar reads the regulator's published consents every morning, pairs up activities in neighbouring blocks with overlapping dates, and flags the ones likely to matter.",
    status: "Live",
    map: "simops",
    links: [
      { label: "Try it", href: "https://simopsradar.com" },
      { label: "Code", href: "https://github.com/pushpingeo/simops-radar" },
    ],
  },
  {
    slug: "living-atlas",
    title: "AI Living World Atlas",
    point: "An open index of the world's public map services, kept alive by an agent.",
    body:
      "Governments publish huge numbers of map layers, but they're hard to find and nobody tells you when one breaks. The atlas crawls public services, keeps the publisher's own metadata, scores each layer for trust, and checks it still works. It's built for AI agents to read first.",
    status: "Building",
    map: "atlas",
    links: [{ label: "Code", href: "https://github.com/pushpingeo/ai-living-world-atlas" }],
  },
  {
    slug: "ntr-skill",
    title: "Does a skill make an AI agent better?",
    point: "A written method halved the risks an AI missed when screening sites, but not how you'd expect.",
    body:
      "Claude screened 45 real IFC projects for land, biodiversity, Indigenous Peoples and heritage risks, with and without a site-screening skill. On sites held back until the end, the skill cut missed risks from 13 to 6 out of 76. My first version of the skill made things worse.",
    status: "Write-up coming",
    map: "ntr",
    links: [],
  },
];

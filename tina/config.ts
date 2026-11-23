import { defineConfig, type Collection, type TinaField } from "tinacms";

// Tina Cloud edits the branch the site was built from.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.WORKERS_CI_BRANCH || // Cloudflare Workers Builds
  process.env.CF_PAGES_BRANCH || // Cloudflare Pages
  "main";

const MAPS = ["north-sea", "engines", "simops", "atlas", "ntr"];

const body = (label = "Text"): TinaField => ({
  type: "rich-text",
  name: "body",
  label,
  isBody: true,
});

const seo: TinaField[] = [
  { type: "string", name: "title", label: "Title", isTitle: true, required: true },
  {
    type: "string",
    name: "description",
    label: "Description for search and link previews",
    ui: { component: "textarea" },
  },
];

const pages: Collection = {
  name: "pages",
  label: "Pages",
  path: "src/content/pages",
  format: "md",
  ui: {
    allowedActions: { create: false, delete: false },
    router: ({ document }) => {
      const f = document._sys.filename;
      if (f === "home") return "/";
      if (f === "not-found") return "/404";
      return `/${f}`;
    },
  },
  templates: [
    {
      name: "home",
      label: "Home page",
      fields: [
        { type: "string", name: "title", label: "Title", isTitle: true, required: true },
        body("Introduction"),
        {
          type: "object",
          name: "buttons",
          label: "Buttons",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.label }) },
          fields: [
            { type: "string", name: "label", label: "Label" },
            { type: "string", name: "href", label: "Link" },
            { type: "string", name: "style", label: "Colour", options: ["orange", "dark"] },
          ],
        },
        {
          type: "object",
          name: "mapKey",
          label: "Map key",
          fields: [
            { type: "string", name: "fields", label: "Fields" },
            { type: "string", name: "pipelines", label: "Pipelines" },
            { type: "string", name: "wind", label: "Wind" },
            { type: "string", name: "licences", label: "Licences" },
            { type: "string", name: "wells", label: "Wells" },
          ],
        },
        { type: "rich-text", name: "mapCaption", label: "Map caption" },
        { type: "string", name: "projectsHeading", label: "Projects heading" },
        { type: "string", name: "projectsLink", label: "Projects link text" },
        { type: "string", name: "notesHeading", label: "Notes heading" },
        { type: "string", name: "notesLink", label: "Notes link text" },
      ],
    },
    {
      name: "about",
      label: "About page",
      fields: [
        ...seo,
        { type: "image", name: "photo", label: "Photo" },
        { type: "string", name: "photoAlt", label: "Photo description (alt text)" },
        body(),
        { type: "string", name: "smallPrint", label: "Small print", ui: { component: "textarea" } },
      ],
    },
    {
      name: "section",
      label: "Section page",
      fields: [...seo, body("Introduction")],
    },
    {
      name: "archive",
      label: "Archive page",
      fields: [
        ...seo,
        body("Introduction"),
        { type: "string", name: "linkedinHeading", label: "LinkedIn heading" },
        { type: "string", name: "linkedinIntro", label: "LinkedIn introduction", ui: { component: "textarea" } },
        { type: "string", name: "blogHeading", label: "Blog heading" },
        { type: "string", name: "blogIntro", label: "Blog introduction", ui: { component: "textarea" } },
      ],
    },
  ],
};

const notes: Collection = {
  name: "notes",
  label: "Notes",
  path: "src/content/notes",
  format: "md",
  ui: { router: ({ document }) => `/notes/${document._sys.filename}` },
  defaultItem: () => ({ date: new Date().toISOString(), kind: "essay", draft: true }),
  fields: [
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    { type: "datetime", name: "date", label: "Date", required: true },
    { type: "string", name: "summary", label: "Summary", required: true, ui: { component: "textarea" } },
    { type: "string", name: "kind", label: "Kind", required: true, options: ["experiment", "essay", "field note"] },
    { type: "string", name: "map", label: "Lead map", options: MAPS },
    { type: "string", name: "mapCaption", label: "Map caption", ui: { component: "textarea" } },
    { type: "string", name: "linkedin", label: "LinkedIn original (if first published there)" },
    { type: "boolean", name: "draft", label: "Draft (hidden on the live site)" },
    body(),
  ],
};

const archive: Collection = {
  name: "archive",
  label: "Archive",
  path: "src/content/archive",
  format: "md",
  ui: { router: ({ document }) => `/archive/${document._sys.filename}` },
  fields: [
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    { type: "datetime", name: "date", label: "Date", required: true },
    { type: "string", name: "source", label: "Source", required: true, options: ["spatial-miscellany", "linkedin"] },
    { type: "string", name: "original", label: "Original address", required: true },
    body(),
  ],
};

const projects: Collection = {
  name: "projects",
  label: "Projects",
  path: "src/content/projects",
  format: "md",
  ui: { router: ({ document }) => `/projects#${document._sys.filename}` },
  fields: [
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    { type: "number", name: "order", label: "Order (1 is first)", required: true },
    { type: "string", name: "status", label: "Status", required: true, options: ["Live", "Building", "Write-up coming"] },
    { type: "string", name: "map", label: "Map", required: true, options: MAPS },
    { type: "string", name: "point", label: "The one thing it shows", required: true, ui: { component: "textarea" } },
    {
      type: "object",
      name: "links",
      label: "Links",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.label }) },
      fields: [
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "href", label: "Link" },
      ],
    },
    { type: "string", name: "note", label: "Note that explains it (file name)" },
    body("Description"),
  ],
};

const settings: Collection = {
  name: "settings",
  label: "Site settings",
  path: "src/content/settings",
  format: "json",
  ui: { global: true, allowedActions: { create: false, delete: false } },
  fields: [
    { type: "string", name: "name", label: "Site name", required: true },
    { type: "string", name: "tagline", label: "Tagline (home page heading)", required: true },
    { type: "string", name: "description", label: "Description for search and link previews", ui: { component: "textarea" } },
    {
      type: "object",
      name: "nav",
      label: "Menu",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.label }) },
      fields: [
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "href", label: "Link" },
      ],
    },
    { type: "string", name: "footerNote", label: "Footer note", ui: { component: "textarea" } },
    { type: "string", name: "github", label: "GitHub link" },
    { type: "string", name: "linkedin", label: "LinkedIn link" },
    { type: "string", name: "email", label: "Email (leave empty to hide)" },
    {
      type: "boolean",
      name: "launched",
      label: "Launched (lets search engines index the site)",
    },
  ],
};

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "images", publicFolder: "public" } },
  schema: { collections: [pages, notes, archive, projects, settings] },
});

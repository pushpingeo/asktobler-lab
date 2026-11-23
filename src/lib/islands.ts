// Every editable region on the site. Inside Tina's editor, the page asks
// /tina-island/<name> to re-render a region as you type. Adding a region
// means adding an entry here and wrapping it in <TinaIsland> on the page.
import type { IslandRegistry } from "@tinacms/astro/experimental";
import Header from "../components/islands/Header.astro";
import Footer from "../components/islands/Footer.astro";
import HomeHero from "../components/islands/HomeHero.astro";
import HomeMapCaption from "../components/islands/HomeMapCaption.astro";
import BlockHead from "../components/islands/BlockHead.astro";
import ProjectRow from "../components/ProjectRow.astro";
import SectionIntro from "../components/islands/SectionIntro.astro";
import AboutBody from "../components/islands/AboutBody.astro";
import NoteBody from "../components/islands/NoteBody.astro";
import ArchivePostBody from "../components/islands/ArchivePostBody.astro";
import ArchiveIndex from "../components/islands/ArchiveIndex.astro";
import { getSettings, getPage, getNote, getArchivePost, getProject, listArchive } from "./tina";

const settings = async () => (await getSettings()).data.settings;
const page = async (name: string, primary = true) => (await getPage(name, primary)).data.pages;

export const islands: IslandRegistry = {
  header: {
    fetch: settings,
    component: Header,
    wrapper: { tag: "header", className: "site-head" },
    propsFromData: (settings, params) => ({ settings, path: params.get("path") ?? "" }),
  },
  footer: {
    fetch: settings,
    component: Footer,
    wrapper: { tag: "footer", className: "site-foot" },
    propsFromData: (settings) => ({ settings }),
  },
  "home-hero": {
    fetch: async () => ({ page: await page("home"), settings: await settings() }),
    component: HomeHero,
    wrapper: { tag: "div", className: "hero-text" },
    propsFromData: (d) => d as Record<string, unknown>,
  },
  "home-map": {
    fetch: () => page("home", false),
    component: HomeMapCaption,
    wrapper: { tag: "figcaption", className: "ui" },
    propsFromData: (page) => ({ page }),
  },
  "block-head": {
    fetch: () => page("home", false),
    component: BlockHead,
    wrapper: { tag: "div", className: "block-head" },
    propsFromData: (page, params) => ({ page, which: params.get("which") }),
  },
  project: {
    fetch: async (_r, params) => (await getProject(params.get("slug") ?? "")).data.projects,
    component: ProjectRow,
    wrapper: { tag: "div" },
    propsFromData: (project, params) => ({ project, detail: params.get("detail") === "1" }),
  },
  section: {
    fetch: (_r, params) => page(params.get("page") ?? ""),
    component: SectionIntro,
    wrapper: { tag: "div", className: "section-intro" },
    propsFromData: (page) => ({ page }),
  },
  about: {
    fetch: () => page("about"),
    component: AboutBody,
    wrapper: { tag: "section", className: "wrap" },
    propsFromData: (page) => ({ page }),
  },
  note: {
    fetch: async (_r, params) => (await getNote(params.get("slug") ?? "")).data.notes,
    component: NoteBody,
    wrapper: { tag: "div" },
    propsFromData: (note) => ({ note }),
  },
  "archive-post": {
    fetch: async (_r, params) => (await getArchivePost(params.get("slug") ?? "")).data.archive,
    component: ArchivePostBody,
    wrapper: { tag: "div" },
    propsFromData: (post) => ({ post }),
  },
  "archive-index": {
    fetch: async () => ({ page: await page("archive"), posts: await listArchive() }),
    component: ArchiveIndex,
    wrapper: { tag: "section", className: "wrap" },
    propsFromData: (d) => d as Record<string, unknown>,
  },
};

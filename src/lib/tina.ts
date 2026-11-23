// Content for every editable part of the site comes through Tina's client.
// requestWithMetadata() tags the data so that, inside Tina's editor, clicking
// a piece of text opens the matching field. Outside the editor it's plain data.
import { requestWithMetadata } from "@tinacms/astro/data";
import client from "../../tina/__generated__/client";

export const getSettings = () =>
  requestWithMetadata(client.queries.settings({ relativePath: "site.json" }));

export const getPage = (name: string, primary = true) =>
  requestWithMetadata(
    client.queries.pages({ relativePath: `${name}.md` }),
    primary ? { priority: "primary" } : undefined,
  );

export const getNote = (slug: string) =>
  requestWithMetadata(client.queries.notes({ relativePath: `${slug}.md` }), { priority: "primary" });

export const getArchivePost = (slug: string) =>
  requestWithMetadata(client.queries.archive({ relativePath: `${slug}.md` }), { priority: "primary" });

export const getProject = (slug: string) =>
  requestWithMetadata(client.queries.projects({ relativePath: `${slug}.md` }));

/** Project file names in display order. */
export async function listProjects() {
  const res = await client.queries.projectsConnection({ first: 100 });
  return (res.data.projectsConnection.edges ?? [])
    .flatMap((e) => (e?.node ? [e.node] : []))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map((p) => p._sys.filename);
}

/** Archive posts, oldest first. */
export async function listArchive() {
  const res = await client.queries.archiveConnection({ first: 500 });
  return (res.data.archiveConnection.edges ?? [])
    .flatMap((e) => (e?.node ? [e.node] : []))
    .map((p) => ({ slug: p._sys.filename, title: p.title, date: new Date(p.date), source: p.source }))
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());
}

export type Settings = Awaited<ReturnType<typeof getSettings>>["data"]["settings"];
export type Page = Awaited<ReturnType<typeof getPage>>["data"]["pages"];
export type Note = Awaited<ReturnType<typeof getNote>>["data"]["notes"];
export type ArchivePost = Awaited<ReturnType<typeof getArchivePost>>["data"]["archive"];
export type Project = Awaited<ReturnType<typeof getProject>>["data"]["projects"];

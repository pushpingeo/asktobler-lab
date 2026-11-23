// The one route that isn't a static page: Tina's editor calls it to re-render
// a region while you type. Ordinary visitors never reach it (it only answers
// the editor's own requests).
import type { APIRoute } from "astro";
import { experimental_createIslandRoute } from "@tinacms/astro/experimental";
import { islands } from "../../lib/islands";

export const prerender = false;
export const ALL: APIRoute = experimental_createIslandRoute(islands);

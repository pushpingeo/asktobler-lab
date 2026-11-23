import { defineConfig } from "astro/config";
import tina from "@tinacms/astro/integration";
import { tinaAdminDevRedirect } from "@tinacms/astro/vite";

// Every page is still prerendered to static HTML. The one exception is
// /tina-island, which Tina's editor calls to redraw text as you type, so the
// site needs a small server: a Cloudflare Worker when built on Cloudflare,
// a Node server when running on this machine.
async function adapter() {
  if (process.env.WORKERS_CI || process.env.CF_PAGES || process.env.DEPLOY_ADAPTER === "cloudflare") {
    return (await import("@astrojs/cloudflare")).default({ imageService: "passthrough" });
  }
  return (await import("@astrojs/node")).default({ mode: "standalone" });
}

export default defineConfig({
  site: "https://asktobler.ai",
  trailingSlash: "ignore",
  output: "static",
  session: false, // no logins or sessions on this site
  adapter: await adapter(),
  integrations: [tina()],
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: { noExternal: ["@tinacms/astro", "@tinacms/bridge"] },
  },
});

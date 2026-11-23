import settings from "../content/settings/site.json";

export function GET() {
  const body = settings.launched
    ? `User-agent: *\nAllow: /\nDisallow: /admin/\n`
    : `# Not launched yet: public, but please don't index.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}

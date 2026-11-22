import { SITE } from "../site.config";

export function GET() {
  const body = SITE.launched
    ? `User-agent: *\nAllow: /\n`
    : `# Not launched yet: public, but please don't index.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}

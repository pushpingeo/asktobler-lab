// Straight quotes to curly ones in the text of an HTML fragment, leaving tags,
// attributes and code alone. Same rules as Astro's smartypants: a quote after
// a space or opening bracket opens, anything else closes (so it's = it’s).
const OPENERS = /[\s(\[{—–-]|^$/;

export function smartQuotes(html: string): string {
  let out = "";
  let prev = ""; // last visible character, across tags
  let inCode = 0;
  const parts = html.split(/(<[^>]*>)/);
  for (const part of parts) {
    if (part.startsWith("<")) {
      if (/^<(code|pre)\b/i.test(part)) inCode++;
      else if (/^<\/(code|pre)>/i.test(part)) inCode = Math.max(0, inCode - 1);
      else if (/^<\/?(p|li|h\d|blockquote|br|td|th|div)\b/i.test(part)) prev = "";
      out += part;
      continue;
    }
    if (inCode) { out += part; continue; }
    // Work on decoded quotes, keep other entities as they are.
    const text = part.replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&quot;|&#34;/g, '"');
    let res = "";
    for (const ch of text) {
      if (ch === "'") res += OPENERS.test(prev) ? "‘" : "’";
      else if (ch === '"') res += OPENERS.test(prev) ? "“" : "”";
      else res += ch;
      prev = ch;
    }
    out += res;
  }
  return out;
}

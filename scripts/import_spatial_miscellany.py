"""Turn recovered Spatial Miscellany posts into archive pages.

The posts were recovered from the Internet Archive (captures of gisconsultancy.com/blog,
2007-2010) and saved as archive-source/spatial-miscellany.json. This script writes a
selection of them to src/content/archive/, keeping the text as written. Images didn't
survive, so they're dropped. Links point to Internet Archive copies from the same year,
because most of the original sites have gone.

Usage: python scripts/import_spatial_miscellany.py
"""

import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "archive-source" / "spatial-miscellany.json"
OUT = ROOT / "src" / "content" / "archive"

# Original post path -> slug for this site. Only these are published.
SELECTED = {
    "xml/pipes": "pipes",
    "xml/onegeology": "onegeology",
    "google/what-happened-to-openspaces": "what-happened-to-openspaces",
    "google/what-happens-when-second-life-meets-google-earth": "second-life-meets-google-earth",
    "microsoft/what%e2%80%99s-your-lat-long": "whats-your-lat-long",
    "mobile-gis/gis-software-above-the-level-of-a-single-device": "gis-software-above-a-single-device",
    "mobile-gis/nokia-mobile-web-server-a-game-changer": "nokia-mobile-web-server",
    "geoweb/what-would-you-create-with-public-information": "what-would-you-create-with-public-information",
    "mobile-gis/mobile-phone-tracking-with-a-nokia-n95-mws": "mobile-phone-tracking-nokia-n95",
    "politics/the-royal-mail-paf-that-old-chestnut": "royal-mail-paf",
    "google/faster-web-mapping-with-google%e2%80%99s-new-browser": "faster-web-mapping-chrome",
    "data/the-power-of-information": "the-power-of-information",
    "arcgis-server-ags/a-next-generation-web-mapping-api": "next-generation-web-mapping-api",
}

BLOG = "gisconsultancy.com/blog/"


def parse_date(s):
    s = re.sub(r"\s+(Got a Comment\?|\d+|by Rob)$", "", s.strip())
    s = re.sub(r"(\d+)(st|nd|rd|th)", r"\1", s)
    for fmt in ("%b %d, %Y", "%B %d, %Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            pass
    raise ValueError(f"Can't read date: {s!r}")


def wayback(url, year):
    if not re.match(r"https?://", url):
        url = "http://" + url
    return f"https://web.archive.org/web/{year}/{url}"


def fix_link(url, year):
    bare = re.sub(r"^https?://(www\.)?", "", url).rstrip("/")
    if bare.startswith(BLOG):
        path = bare[len(BLOG):]
        if path in SELECTED:
            return f"/archive/{SELECTED[path]}"
    if "wikipedia.org" in url:
        return url
    return wayback(url, year)


def clean(md, year):
    md = re.sub(r"\[\[image:[^\]]*\]\]\([^)]*\)", "", md)  # linked images
    md = re.sub(r"\[image:[^\]]*\]", "", md)  # images
    md = re.sub(r"\]\(([^)]+)\)", lambda m: "](" + fix_link(m.group(1), year) + ")", md)
    lines = []
    for line in md.split("\n"):
        line = line.strip()
        # Photo credits that belonged to images we no longer have.
        if line.startswith("*") and re.search(r"flickr|photo", line, re.I):
            continue
        lines.append(line)
    md = "\n".join(lines)
    md = re.sub(r"\n{3,}", "\n\n", md).strip()
    return md


def main():
    posts = json.load(open(SRC))
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.md"):
        old.unlink()
    n = 0
    for p in posts:
        path = p["key"][len(BLOG):]
        if path not in SELECTED:
            continue
        d = parse_date(p["date"])
        slug = SELECTED[path]
        title = p["title"].replace("'", "''")
        original = wayback("http://" + p["key"] + "/", d.year)
        body = clean(p["md"], d.year)
        (OUT / f"{slug}.md").write_text(
            f"---\ntitle: '{title}'\ndate: {d.isoformat()}\noriginal: '{original}'\n---\n\n{body}\n"
        )
        n += 1
    print(f"Wrote {n} posts to {OUT}")
    missing = set(SELECTED) - {p["key"][len(BLOG):] for p in posts}
    if missing:
        print("Not found:", missing)


if __name__ == "__main__":
    main()

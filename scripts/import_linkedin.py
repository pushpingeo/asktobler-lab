"""Turn published LinkedIn articles (from LinkedIn's data export) into notes.

The export's HTML files for the chosen articles are kept in archive-source/linkedin/.
Text is kept as written. LinkedIn-only bits are dropped: the cover image (its link
expires), hashtag lines and the closing "Let's talk" prompt.

Usage: python scripts/import_linkedin.py   (needs beautifulsoup4 and markdownify)
"""

import re
from pathlib import Path

from bs4 import BeautifulSoup
from markdownify import markdownify

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "archive-source" / "linkedin"
OUT = ROOT / "src" / "content" / "notes"

# file stem -> (slug, kind, summary)
ARTICLES = {
    "here-comes-everybodythe-power-surveying-without-surveyor-rob-dunfey": (
        "here-comes-everybody", "essay",
        "A consumer drone, a museum in Miri and a weekend of processing: what amateurisation might mean for surveying."),
    "rethinking-laws-geography-world-transformers-encodings-rob-dunfey-gkdce": (
        "rethinking-laws-of-geography", "essay",
        "If meaning can emerge from statistics rather than rules, what happens to Tobler's first law?"),
    "gis-analysts-still-exist-2035-rob-dunfey-pe8me": (
        "will-gis-analysts-exist-in-2035", "essay",
        "The people? Hopefully. The role? Not so sure. A first job in 2001, asked again of today's AI."),
    "geoai-few-useful-links-perspectives-rob-dunfey-odvkf": (
        "geoai-useful-links", "field note",
        "A short reading list on GeoAI: the big picture, research, big tech and a searchable planet."),
    "reflections-positioning-future-geospatial-information-rob-dunfey-xi36f": (
        "future-geospatial-ecosystem", "essay",
        "The UN-GGIM paper on the future geospatial ecosystem, and the question of where spatial analysis fits."),
}


def convert(path):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    h1 = soup.find("h1")
    title = h1.get_text(" ", strip=True)
    url = h1.find("a")["href"] if h1.find("a") else ""
    body = soup.body
    h1.decompose()
    for img in body.find_all("img"):
        parent = img.parent
        img.decompose()
        if parent.name == "a" and not parent.get_text(strip=True):
            parent.decompose()
    text = markdownify(str(body), heading_style="ATX")
    published = re.search(r"Published on (\d{4}-\d{2}-\d{2})", text).group(1)
    out = []
    for line in text.split("\n"):
        s = line.strip()
        if re.match(r"^(Created|Published) on ", s):
            continue
        if s and all(tok.strip("*").startswith("#") and not tok.startswith("##") for tok in s.split()):
            continue  # hashtag line
        if re.match(r"^Let.s talk", s):
            continue
        if s.startswith("### "):
            s = "## " + s[4:]
        out.append(s)
    md = re.sub(r"\n{3,}", "\n\n", "\n".join(out)).strip()
    return title, url, published, md


def main():
    for stem, (slug, kind, summary) in ARTICLES.items():
        title, url, published, md = convert(SRC / f"{stem}.html")
        title = re.sub(r"^[^\w\"']+", "", title).strip()  # drop leading emoji
        fm = (
            "---\n"
            f"title: '{title.replace(chr(39), chr(39) * 2)}'\n"
            f"date: {published}\n"
            f"summary: '{summary.replace(chr(39), chr(39) * 2)}'\n"
            f"kind: {kind}\n"
            f"linkedin: '{url}'\n"
            "---\n\n"
        )
        (OUT / f"{slug}.md").write_text(fm + md + "\n")
        print(slug, published, len(md))


if __name__ == "__main__":
    main()

"""Draw the site's maps as SVG from real open data.

The maps are inlined into the pages, so their labels use the site's fonts and
colours come from CSS classes (see src/styles/maps.css).

Inputs (not kept in this repo, they're big):
  --ns      data/ folder of pushpingeo/north-sea-geo-demo (NSTA and Crown Estate layers)
  --simops  data/ folder of pushpingeo/simops-radar (NSTA licence blocks)
  --land    Natural Earth 10m land GeoJSON (public domain)

Usage:
  pip install shapely
  python scripts/make_maps.py --ns ../north-sea-geo-demo/data \
      --simops ../simops-radar/data --land ne_10m_land.geojson
"""

import argparse
import json
import math
from pathlib import Path

from shapely.geometry import box, mapping, shape, Point
from shapely.ops import unary_union

OUT = Path(__file__).resolve().parent.parent / "src" / "maps"


def load(path):
    with open(path) as f:
        return [(shape(ft["geometry"]), ft["properties"]) for ft in json.load(f)["features"] if ft.get("geometry")]


class Proj:
    """Equirectangular with the longitude squeezed for the map's middle latitude.
    Good enough for pictures at North Sea scale; no measuring is done with it."""

    def __init__(self, west, south, east, north, width):
        self.w, self.s, self.e, self.n = west, south, east, north
        self.k = math.cos(math.radians((south + north) / 2))
        self.scale = width / ((east - west) * self.k)
        self.width = width
        self.height = (north - south) * self.scale

    def xy(self, lon, lat):
        return ((lon - self.w) * self.k * self.scale, (self.n - lat) * self.scale)


def ring_path(coords, p):
    pts = [p.xy(x, y) for x, y in coords]
    return "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z"


def line_path(coords, p):
    pts = [p.xy(x, y) for x, y in coords]
    return "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts)


def geom_path(g, p):
    t = g.geom_type
    if t == "Polygon":
        return "".join(ring_path(r.coords, p) for r in [g.exterior, *g.interiors])
    if t == "LineString":
        return line_path(g.coords, p)
    if t.startswith("Multi") or t == "GeometryCollection":
        return "".join(geom_path(part, p) for part in g.geoms)
    return ""


def clip_simplify(geoms, frame, tol):
    out = []
    for g in geoms:
        if not g.is_valid:
            g = g.buffer(0)
        if not g.intersects(frame):
            continue
        g = g.intersection(frame).simplify(tol, preserve_topology=True)
        if not g.is_empty:
            out.append(g)
    return out


def graticule(p, step=1.0, ticks=True, label_every=2, lines=True):
    """Grid lines plus chart-style ticks and labels on the neatline."""
    parts = []
    if lines:
        parts.append('<g class="m-grat">')
        lon = math.ceil(p.w / step) * step
        while lon <= p.e + 1e-9:
            x, _ = p.xy(lon, p.n)
            parts.append(f'<path d="M{x:.1f} 0V{p.height:.1f}"/>')
            lon += step
        lat = math.ceil(p.s / step) * step
        while lat <= p.n + 1e-9:
            _, y = p.xy(p.w, lat)
            parts.append(f'<path d="M0 {y:.1f}H{p.width:.1f}"/>')
            lat += step
        parts.append("</g>")
    if ticks:
        parts.append('<g class="m-ticks">')
        lon = math.ceil(p.w / step) * step
        while lon <= p.e + 1e-9:
            x, _ = p.xy(lon, p.n)
            parts.append(f'<path d="M{x:.1f} 0v7M{x:.1f} {p.height:.1f}v-7"/>')
            lon += step
        lat = math.ceil(p.s / step) * step
        while lat <= p.n + 1e-9:
            _, y = p.xy(p.w, lat)
            parts.append(f'<path d="M0 {y:.1f}h7M{p.width:.1f} {y:.1f}h-7"/>')
            lat += step
        parts.append("</g><g class=\"m-ticklabel\">")
        lon = math.ceil(p.w / step) * step
        while lon <= p.e + 1e-9:
            if round(lon) % label_every == 0:
                x, _ = p.xy(lon, p.n)
                lab = f"{abs(round(lon))}°{'E' if lon > 0 else 'W' if lon < 0 else ''}"
                parts.append(f'<text x="{x + 4:.1f}" y="{p.height - 10:.1f}">{lab}</text>')
            lon += step
        lat = math.ceil(p.s / step) * step
        while lat <= p.n + 1e-9:
            if round(lat) % label_every == 0:
                _, y = p.xy(p.w, lat)
                parts.append(f'<text x="11" y="{y - 4:.1f}">{round(lat)}°N</text>')
            lat += step
        parts.append("</g>")
    return "".join(parts)


def svg(p, body, title, cls):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {p.width:.0f} {p.height:.0f}" '
        f'class="map {cls}" preserveAspectRatio="xMidYMid {'slice' if cls == 'map-thumb' else 'meet'}" role="img" aria-label="{title}"><title>{title}</title>'
        f'<rect class="m-sea" width="{p.width:.0f}" height="{p.height:.0f}"/>{body}'
        f'<rect class="m-neat" x="0.5" y="0.5" width="{p.width - 1:.0f}" height="{p.height - 1:.0f}"/></svg>'
    )


def hero(ns, land):
    p = Proj(-3.6, 52.6, 9.4, 61.6, 760)
    frame = box(p.w - 0.5, p.s - 0.5, p.e + 0.5, p.n + 0.5)
    body = []
    body.append(graticule(p, ticks=False))

    lic = clip_simplify([g for g, _ in load(ns / "licences.geojson")], frame, 0.004)
    body.append('<path class="m-lic" d="' + "".join(geom_path(g, p) for g in lic) + '"/>')

    wind = clip_simplify([g for g, _ in load(ns / "wind.geojson")], frame, 0.004)
    body.append('<path class="m-wind" d="' + "".join(geom_path(g, p) for g in wind) + '"/>')

    fields = clip_simplify([g for g, _ in load(ns / "fields.geojson")], frame, 0.003)
    body.append('<path class="m-field" d="' + "".join(geom_path(g, p) for g in fields) + '"/>')

    pipes = clip_simplify([g for g, _ in load(ns / "pipelines.geojson")], frame, 0.004)
    body.append('<path class="m-pipe" d="' + "".join(geom_path(g, p) for g in pipes) + '"/>')

    # 13,000 wells is too many dots for a picture: keep one per small grid cell.
    seen, dots = set(), []
    for g, _ in load(ns / "wells.geojson"):
        key = (round(g.x / 0.04), round(g.y / 0.025))
        if key in seen or not frame.contains(g):
            continue
        seen.add(key)
        x, y = p.xy(g.x, g.y)
        dots.append(f"M{x:.1f} {y:.1f}h.01")
    body.append('<path class="m-well" d="' + "".join(dots) + '"/>')

    landg = clip_simplify([g for g, _ in load(land)], frame, 0.01)
    body.append('<path class="m-land" d="' + "".join(geom_path(g, p) for g in landg) + '"/>')

    labels = [
        (-2.9, 57.2, "Scotland", "m-lab-land"),
        (7.6, 60.4, "Norway", "m-lab-land"),
        (7.75, 56.1, "Denmark", "m-lab-land"),
        (-1.6, 53.3, "England", "m-lab-land"),
        (2.4, 58.6, "North Sea", "m-lab-sea"),
    ]
    for lon, lat, t, c in labels:
        x, y = p.xy(lon, lat)
        body.append(f'<text class="{c}" x="{x:.1f}" y="{y:.1f}">{t}</text>')

    body.append(graticule(p, lines=False))
    title = ("Map of the North Sea drawn from open data: oil and gas fields, pipelines, "
             "licences, wells and offshore wind sites")
    return svg(p, "".join(body), title, "map-hero")


def engines(ns, land):
    """A crop of the central North Sea with three nested rings, as in the demo's Compare tab."""
    p = Proj(0.4, 56.6, 2.6, 57.9, 520)
    frame = box(p.w - 0.2, p.s - 0.2, p.e + 0.2, p.n + 0.2)
    body = [graticule(p, step=0.5, ticks=False)]
    fields = clip_simplify([g for g, _ in load(ns / "fields.geojson")], frame, 0.001)
    body.append('<path class="m-field" d="' + "".join(geom_path(g, p) for g in fields) + '"/>')
    pipes = clip_simplify([g for g, _ in load(ns / "pipelines.geojson")], frame, 0.001)
    body.append('<path class="m-pipe" d="' + "".join(geom_path(g, p) for g in pipes) + '"/>')
    cx, cy = p.xy(1.5, 57.25)
    for r, c in [(128, "m-ring m-ring-a"), (120, "m-ring m-ring-b"), (112, "m-ring m-ring-c")]:
        body.append(f'<circle class="{c}" cx="{cx:.1f}" cy="{cy:.1f}" r="{r}"/>')
    title = "Central North Sea fields and pipelines with three nested rings, one per engine"
    return svg(p, "".join(body), title, "map-thumb")


def simops(simops_dir, ns):
    p = Proj(0.35, 56.85, 1.65, 57.5, 520)
    frame = box(p.w - 0.2, p.s - 0.2, p.e + 0.2, p.n + 0.2)
    blocks = [(g, pr) for g, pr in load(simops_dir / "blocks.geojson") if g.intersects(frame)]
    gannet = [g for g, pr in load(ns / "fields.geojson") if pr.get("name", "").upper() == "GANNET F"]
    gannet_pt = gannet[0].representative_point() if gannet else Point(0.998, 57.184)
    body = []
    hot = []
    for g, pr in blocks:
        g2 = g.intersection(frame).simplify(0.0005)
        cls = "m-block"
        if pr["key"] == "21/29":
            cls = "m-block m-hot"
        elif g.contains(gannet_pt) and pr["key"] != "21/29":
            cls = "m-block m-hot2"
        d = geom_path(g2, p)
        (hot if "hot" in cls else body).append(f'<path class="{cls}" d="{d}"/>')
        c = g2.representative_point()
        x, y = p.xy(c.x, c.y)
        body.append(f'<text class="m-blocklab" x="{x:.1f}" y="{y:.1f}">{pr["key"]}</text>')
    body = hot[:0] + body + hot
    title = "UK licence blocks around 21/29, with the two blocks of the Gannet example picked out"
    return svg(p, "".join(body), title, "map-thumb")


def atlas(land):
    """Orthographic globe, coastline only, centred on the North Atlantic."""
    lon0, lat0 = math.radians(-10), math.radians(40)
    R, size = 240, 520
    c = size / 2

    def proj(lon, lat):
        lo, la = math.radians(lon), math.radians(lat)
        cosc = math.sin(lat0) * math.sin(la) + math.cos(lat0) * math.cos(la) * math.cos(lo - lon0)
        x = R * math.cos(la) * math.sin(lo - lon0)
        y = R * (math.cos(lat0) * math.sin(la) - math.sin(lat0) * math.cos(la) * math.cos(lo - lon0))
        return c + x, c - y, cosc >= 0

    def path(coords, close):
        segs, cur = [], []
        for lon, lat in coords:
            x, y, vis = proj(lon, lat)
            if vis:
                cur.append(f"{x:.1f} {y:.1f}")
            elif cur:
                segs.append(cur)
                cur = []
        if cur:
            segs.append(cur)
        return "".join("M" + "L".join(s) for s in segs if len(s) > 1)

    body = [f'<circle class="m-globe" cx="{c}" cy="{c}" r="{R}"/>', '<g class="m-grat">']
    for lon in range(-180, 180, 20):
        body.append(f'<path d="{path([(lon, la) for la in range(-90, 91, 3)], False)}"/>')
    for lat in range(-80, 81, 20):
        body.append(f'<path d="{path([(lo, lat) for lo in range(-180, 181, 3)], False)}"/>')
    body.append("</g>")
    d = []
    for g, _ in load(land):
        g = g.simplify(0.3)
        for poly in getattr(g, "geoms", [g]):
            if poly.area < 2:
                continue
            d.append(path(poly.exterior.coords, True))
    body.append('<path class="m-coast" d="' + "".join(d) + '"/>')
    inner = "".join(body)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" class="map map-thumb" preserveAspectRatio="xMidYMid slice" '
        f'role="img" aria-label="Line drawing of the globe"><title>Line drawing of the globe</title>'
        f'<rect class="m-paper" width="{size}" height="{size}"/>{inner}</svg>'
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ns", type=Path, required=True)
    ap.add_argument("--simops", type=Path, required=True)
    ap.add_argument("--land", type=Path, required=True)
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    files = {
        "north-sea.svg": hero(a.ns, a.land),
        "engines.svg": engines(a.ns, a.land),
        "simops.svg": simops(a.simops, a.ns),
        "atlas.svg": atlas(a.land),
    }
    for name, text in files.items():
        (OUT / name).write_text(text)
        print(f"{name}: {len(text) / 1024:.0f} KB")


if __name__ == "__main__":
    main()

---
title: The map was right. The labels weren't.
date: 2026-11-28
summary: Tobler's first printed map sheet looked right but its coordinates didn't. Checking why turned into a question about how you build geodetic integrity into an AI application.
kind: field note
draft: true
---

This morning Tobler drew its first printed map sheet. An A3 heritage map for a battery storage site near Culham, south of Oxford: the site in red, listed buildings, a registered park and garden, a scheduled barrow cemetery 500 metres to the south. Title block, scale bar, north arrow, legend. It looked like the real thing.

Something about the coordinates bothered me. I couldn't say what straight away, so I asked Claude to work it out using the same coordinate reference and cartography skills Tobler uses, before I gave my own view.

It got further than I expected.

## First, were the features in the right place?

The first question was whether the features were in the right place, not whether the labels looked odd. Historic England publishes its listed buildings in British National Grid, on the OSGB36 datum, and will hand them back in WGS 84 if you ask. A server doing that conversion has to apply a datum shift. If it doesn't, everything moves about 100 metres. Nothing on the map would look wrong.

So Claude took one listed building, Thame Lane Bridge, and compared three positions:

- Historic England's own WGS 84 output;
- the same point taken from its native grid coordinates through EPSG's standard transformation (OSGB36 to WGS 84 (6), good to about 2 m);
- the same point with no datum shift at all.

The first two agreed to within a metre or two. The third was 115 m away. So the server had done its job, and the sheet had drawn the bridge where it is.

That 115 m figure is a useful test in Great Britain. A difference of a metre or two is two valid transformations disagreeing slightly. A difference of about a hundred means someone skipped the shift.

## So what was wrong?

The labels. The sheet was in UTM, and the ticks read things like "5724.5". That's kilometres with a decimal, which is no convention I've ever seen on a map. That's fixable in an afternoon.

The more interesting answer came next. Even with good labels, the sheet's numbers matched nothing a UK consultant uses. Historic England gives that bridge as 452 824, 196 055. Planning applications use British National Grid, and so do Natural England's impact risk zones. UTM had been my own choice, because one rule that works worldwide appealed to me. On a UK planning map it's foreign.

So the rule changed. Each run picks one coordinate system for everything it shows: the country's own grid where it has one, UTM where it doesn't. The choice is made once, in code, and written into the run record along with the transformation it used and how accurate that is. The report, the map series and the data download all read that one record. None of them picks its own.

## Grid lines that overstate the accuracy

The early sheets had a full grid and a latitude/longitude graticule drawn across the map. I took both off.

These maps are for screening. Nobody navigates by them. And a crisp one-kilometre grid over a boundary someone digitised from a planning PDF suggests more accuracy than the sources have. Ticks round the edge are enough to read a position. The sheet says which grid it's in, how the data got there, and that it's a screening map, not a survey or a legal boundary.

## How do you build this into an AI application?

This is the question that interests me most. Geodetic integrity isn't something you can ask a language model to have. It has to come from how the system is put together. Five things are working for us so far.

**The model never touches a coordinate.** It sees names, distances and areas. Every number with a datum attached is computed by code.

**Every geodetic decision happens in one place.** One module chooses transformations from the EPSG registry. Another chooses the coordinate system a map is shown in, from a small table of national grids. Both record what they did. That's provenance, the same thing we'd insist on for any dataset, applied to positions.

**Skills hold the conventions, and code enforces what must always hold.** Written skills explain the choices: when to ask the person, which grid a country uses, why there are no grid lines. Tests and invariants make the rules that must never break true by construction. "One coordinate system per run" is now one of them.

**Check against something independent.** Known points published in both systems become unit tests. At run time, a service's own conversion can be compared with ours, and anything far apart gets flagged. That's how this morning's check started, and it should run every time, not only when I happen to be suspicious.

**Say what isn't known.** The Culham site boundary came out of my own georeferencing tool, exported straight to WGS 84 from a plan in British National Grid. The file doesn't say which transformation the tool used. I know it's probably fine. The sheet shouldn't have to take my word for it.

None of this is new to anyone who has managed survey data. Record the operation, check it against an independent source, write down what you don't know. In data management it's called lineage and reconciliation. What's new is having a model in the loop that sounds confident about everything. That makes the discipline matter more, not less.

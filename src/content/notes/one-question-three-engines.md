---
title: One question, three engines
date: 2026-11-22
summary: Ask a spatial question once and three different engines answer it. Mostly they agree, and the places they don't are the interesting part.
kind: experiment
map: engines
mapCaption: Central North Sea fields and pipelines. The demo's Compare view draws each engine's answer as a ring, one inside the other.
---

In GIS, the software has usually come first. You pick a platform, learn its tools, and the platform shapes how you think about the problem.

So here's a question I wanted to test. If you ask in plain English and AI writes the analysis, does the engine underneath still matter?

## The experiment

[One question, three engines](https://pushpingeo.github.io/north-sea-geo-demo/) is a map of UK North Sea data: wells, fields, platforms, pipelines, licences and offshore wind sites. All of it is open data from the NSTA and the Crown Estate.

You type a question. *Which offshore wind sites have legacy oil and gas wells inside them?* Then:

1. Claude writes a precise **spec**: which layers, which filters, what "near" means in metres, what to return.
2. Claude implements that spec three times, in **Turf.js**, **DuckDB** and **GeoPandas**. All three run in your browser.
3. A **Compare** view puts the three answers on the map and lists anywhere they disagree.

A question costs about a penny.

## Why the spec matters

Without a spec, "near" might be 10 km for one engine and 20 km for another, and you're comparing interpretations, not engines.

With the spec, any difference left over comes from the engines themselves. That makes the results comparable. It also makes them easier to trust, because you can read the spec and decide if it's what you meant before looking at any answers.

None of that is specific to GIS, either.

## What happened

Mostly, the three engines agree. Same features, same counts.

When they don't, it's for real reasons. Ask who operates the most licensed acreage and Turf puts Serica at 2,887 km², DuckDB at 2,901 and GeoPandas at 2,903. Turf measures on the sphere. The other two measure on the British National Grid. Half a percent apart, and each one is right on its own terms.

Distance thresholds are where it gets fiddly. The Pierce field sits right on a 20 km line from a wind site, just east of 2°E. With one datum transformation it's 19,869 m away. With another it's 20,000 m. In or out depends on a choice most people never knew they made.

That's not a reason to distrust the tools. It's a reason to see the method, which is exactly what you get when AI writes the code and shows its working.

## So does the engine matter?

Less than it used to. Once AI is the interface, the engine becomes a choice, not a lock-in. You pick it for speed, cost, scale or where your data already sits, not because it's the one your team learnt ten years ago.

It still matters at the edges, though. Projections, datums, how area is measured. The difference is that those edges are now visible, side by side, instead of buried in whichever tool you happened to use.

[Try it](https://pushpingeo.github.io/north-sea-geo-demo/), or read [the code](https://github.com/pushpingeo/north-sea-geo-demo). There are five example questions if you'd rather not type.

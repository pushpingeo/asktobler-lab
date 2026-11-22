---
title: 'Here Comes Everybody...The Power of Surveying without the Surveyor'
date: 2017-06-11
summary: 'A consumer drone, a museum in Miri and a weekend of processing: what amateurisation might mean for surveying.'
kind: essay
linkedin: 'https://www.linkedin.com/pulse/here-comes-everybodythe-power-surveying-without-surveyor-rob-dunfey'
---

I shamelessly steal my title from the Clay Shirkey book that popularised the idea of '[mass amateurisation](https://www.ted.com/talks/clay_shirky_on_institutions_versus_collaboration)':

> Here Comes Everybody, the Power of Organising without the Organisation

## Mass Amateurisation

On the surface, it's a simple idea...new technology is facilitating the 'amateurisation' of established 'professions'. For example, blogs allow anybody to publish news to an audience and this has resulted in the amateurisation of journalism. In the geospatial domain, we have also witnessed this trend, first with map making and Open Street Map, then geospatial web development with Google Maps, and now it would appear surveying with the latest generation of consumer drones.

A couple of weeks ago I purchased the new DJI Mavic Pro, it was an impulse purchase from the DJI flagship store in Hong Kong, it set me back $1000 (so that puts it in new laptop or camera lens territory). Over the last couple of weeks I have built my confidence flying the Mavic and on Saturday morning, I used it for its first (amateur) survey job at the Miri Petroleum museum...you can click the image below to see the results:

## Data Acquisition

The Mavic Pro is very easy to fly. It's pretty much invisible to the eye at 400m but will fly comfortably for a kilometre, beaming back high definition first person view from the drone to my iPhone with negligible latency. It can fly predetermined routes and will fly for 25 minutes on a single battery. It includes obstacle avoidance sensors and will land itself.

It's more than a toy, it's a tool...two minutes on my iPhone and I can generate survey 'runlines' for an area of interest, tap to upload to the Mavic and then it heads off on its imagery acquisition mission...12MP images, equally spaced with 75% overlap, one image every couple of seconds (geo-referenced). Eight minutes later, it's flown 1.5 miles and I have 103 images ready for processing.

## Data Processing

I looked at two workflows for data processing, one local using my Mac, [Docker](https://www.docker.com) and [WebODM](https://hub.docker.com/r/dbrosy/webodm/) and the second was cloud based using [Maps Made Easy](https://www.mapsmadeeasy.com). Both approaches worked well, stitching the photos, ortho-rectification, phase correlation, edge matching and a derived digital terrain model...practically 'off the shelf'.

## So what does 'Amateurisation' mean for Survey as a Profession?

No fear...'amateurisation' doesn't appear to mean the end of 'professionalism', despite the prevalence of blogs and photo sharing websites, we still pay for newspapers and wedding photographers. However, over a decade after Shirkey first popularised the idea, it's evident amateurisation has been both a challenge and opportunity for established professions and some organisations have thrived whilst others wallowed.

In his 2005 [TED talk](https://www.ted.com/talks/clay_shirky_on_institutions_versus_collaboration) Shirkey gracefully admits, he has no idea how the trend of amateurisation will play out, but he does make a couple of suggestions that appear to have held their ground over the course of the last 12 years (at least in the domain of journalism). Firstly, organisations are forced to focus on the 80% of business applications that deliver the greatest return, this comes at the cost of ignoring the long tail of potential applications that are many in number, but don't have the volume (repeatability) to deliver a meaningful return for an organisation. Amateurisation brings additional resources to a profession that can be used to service the long tail of potential applications (e.g. a survey of Miri Petroleum museum). Secondly, professions are most likely to prosper if they can facilitate and harness amateurisation rather than defend quality by means of exclusivity. For example, one can compare news organisations providing [publication platforms](https://www.theguardian.com/profile/guardian-readers) for their readers, with those that erect [pay walls](http://www.telegraph.co.uk).

This makes me wonder, what is the long tail of survey applications that can now be serviced with amateurisation? Will survey companies choose to erect 'pay walls' or look to foster and harness amateurisation?

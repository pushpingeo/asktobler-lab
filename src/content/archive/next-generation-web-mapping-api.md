---
title: 'A next generation web mapping API…'
date: 2010-08-08
source: spatial-miscellany
original: 'https://web.archive.org/web/2010/http://gisconsultancy.com/blog/arcgis-server-ags/a-next-generation-web-mapping-api/'
---

So ArcGIS 10 has been out for a month, and it’s all very quite? A recent project threw up the opportunity to get down to work with the new [JavaScript ‘2.0’ API](https://web.archive.org/web/2010/http://resources.esri.com/help/webapi/javascript/arcgis/) and ArcGIS Server 10 – I’m really impressed, and it really distinguishes the ESRI web mapping kit, from the ever popular [GYM & OpenLayers](https://web.archive.org/web/2010/http://www.mapstraction.com/).

Most impressive is the level of abstraction in the API, ESRI are really delivering on the sales pitch on this one, its small and powerful – this makes it super quick to develop with, case in hand being the handful of lines required to build a custom identify dialog. In three days last week we went from a handful of Feature Classes to a full-blown web app (and it’s robust). But it’s not just the lean API that makes for rapid development, the close coupling of ArcGIS Server to the Map Document also starts to pay dividends. I’ve always been cautious of MXD driven web services, as its eating up the full set of ArcObjects under the cover, which eats memory on the server, SOC processes rarely start the day on less than 60MBs for breakfast, but the trade off is access to all the goodness of the MXD, in this case some [VBScript labelling](https://web.archive.org/web/2010/http://webhelp.esri.com/arcgisdesktop/9.3/index.cfm?TopicName=specifying_the_text_of_labels) and scale thresholds – this would be a nightmare and time consuming to code on the client.

From a consultancy perspective, how do you make a business model of delivering JS, Silverlight or Flex based solutions, when the pre-sales associated with securing the work could often be larger than the job itself?

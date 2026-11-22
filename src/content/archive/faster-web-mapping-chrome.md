---
title: 'Faster web mapping with Google’s new browser?'
date: 2008-10-09
original: 'https://web.archive.org/web/2008/http://gisconsultancy.com/blog/google/faster-web-mapping-with-google%e2%80%99s-new-browser/'
---

Last month Google released a web browser…[Google Chrome](https://web.archive.org/web/2008/http://www.google.com/chrome). It appears to have debuted to [mixed reviews](https://web.archive.org/web/2008/http://geobabble.wordpress.com/2008/09/15/chrome-ie-killer-or-not/), personally I really like it, but others have had [less favourable experience](https://web.archive.org/web/2008/http://www.archaeogeek.com/blog/2008/09/04/chrome-not-that-shiny-really/). On the surface, it looks much like any other web browser, but underneath, [it’s a bit of an animal](https://web.archive.org/web/2008/http://uk.youtube.com/watch?v=saZDkj_XExQ).

Google have acquired a new JavaScript engine ([V8](https://web.archive.org/web/2008/http://code.google.com/apis/v8/intro.html)) written from the ground up to work more efficiently with websites that have large amounts of JavaScript rather than the little snippets of JavaScript which was typical of websites developed when JavaScript was first integrated into Netscape Navigator in the mid 1990s.

Typically JavaScript engines use a dictionary-like data structure as storage for object properties – each property access requires a dynamic lookup to resolve the property’s location in memory. V8 works differently…the first time V8 encounters an object it interprets how the object would be represented as a class, creating a hidden class, which means the next time the object is encountered, its properties can be accessed from memory without the time consuming dynamic look up.

Google give a far more comprehensive introduction to this approach in their [documentation of V8](https://web.archive.org/web/2008/http://code.google.com/apis/v8/design.html), conveniently they use the example of an object common to all GIS developers…a Point.

**So What?**

The novel approach taken by the V8 JavaScript engine, presents a new opportunity for GIS web developers to work with Points, Lines and Polygons on the web client instead of the web server as is typical of a web based GIS. Using JavaScript in the web browser removes the need for lengthy round trips to the Server, which will make for faster web mapping applications.

Here and now, this will allow web mapping API developers to work with more markers, the typical 100 marker limit of Google Maps applications (and similar web mapping API’s) – is no more; Mike Williams and his team have reported working with as many as [2000 markers](https://web.archive.org/web/2008/http://econym.org.uk/gmap/chrome.htm) when using Google Maps within Chrome.

Chrome isn’t the only web browser to recognize the importance of working with JavaScript heavy web sites, for example, much work is being done on a new [JavaScript engine for Firefox](https://web.archive.org/web/2008/https://wiki.mozilla.org/JavaScript:TraceMonkey). Perhaps in the future, as this approach gains support, spatial analysis functionality can move from the server to the client, which would make for a more engaging web mapping experience?

If anyone is looking for a dissertation project, or has time of their hands, it would be interesting to see the outcome of taking some topological operators (e.g. [Java Topology Suite](https://web.archive.org/web/2008/http://www.vividsolutions.com/jts/jtshome.htm)), Google Web Toolkit ([GWT](https://web.archive.org/web/2008/http://code.google.com/webtoolkit/)) and [GWT for Google Maps](https://web.archive.org/web/2008/http://code.google.com/docreader/#p=gwt-google-apis&s=gwt-google-apis&t=Maps), all served up with Google Chrome?

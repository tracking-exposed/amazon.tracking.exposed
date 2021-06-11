---
title: "A tool for researchers that test their assumptions on personalized discrimination"
subtitle: "...as then, becomes only a matter of designing the methodology that allows you to prove or disprove it!"
draft: false

og_title: "How researchers can analyze Amazon algorithm?"
og_type: "website"
og_image: "http://amazon.tracking.exposed/amazon-logo.jpg"
og_url: "https://amazon.tracking.exposed/how-does-it-work"
og_description: "A tool for researchers that test their assumptions on personalized discrimination"
---

### How does it work?

1. You should install the browser extension: it collects from two pages: _product_ and _search query_.
2. Then, the researcher might repeat the same searches with different variables (profile logged or not, same IP, same postal code, browser language, clean cookies, etc.)
3. The extension gives access to the personal page, and with the APIs implemented in our server,, you can download aggregated data in CSV and JSON format. There are also public APIs to download, for example, all the search queries.
4. The browser extension does not keep track of any personal data related to the profile; therefore, the method of content selection is mandatory to interpret the personalization. *Documentation is still a work in progress!* If you want to know more, please reach out to support at tracking dot exposed.

To explore the data and the APIs, at the moment, you can only [follow the code](https://github.com/tracking-exposed/amtrex/blob/master/backend/bin/server.js#L94).

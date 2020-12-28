---
title: "What amazon.tracking.exposed does"
draft: false

og_title: "an infrastructure for researcher: analysis of Amazon algorithm"
og_type: "website"
og_image: "http://amazon.tracking.exposed/amazon-logo.jpg"
og_url: "https://amazon.tracking.exposed/about"
og_description: "Dettagli sulla nostra analisi dell'algoritmo di personalizzazion usato in amazon.it"
---

# It collects from two pages: product and search query.

1. You should install the browser extension.
2. The researcher might try to repeat the same searches with difgerent variables (profile logged or not, same ip, same postal code, browser language, clean cookies, etc)
3. The extension gives access to the personal page, and **with APIs you can download aggregated data in CSV and JSON** format. There are also public APIs to download, for example, all the search queries.
4. The browser extension do not keep track of any personal data related to the profile, therefore, the method of content selection is mandatory to interpret the personalization. Documentation is it still a work in progress! Please reach out to support at tracking dot exposed.

# How have been used for? Five winter school research projects:

* [Tracking Gender Bias in Amazon Search Results](https://wiki.digitalmethods.net/Dmi/WinterSchool2020trackinggenderbiasamazon).
* [Is Amazon.com the Same Everywhere?](https://wiki.digitalmethods.net/Dmi/WinterSchool2020amazonregional).
* [Choose Your Price: Windows 10 vs. macOS](https://wiki.digitalmethods.net/Dmi/WinterSchool2020AmazonOS).
* [Does Amazon know your Wealth?](https://wiki.digitalmethods.net/Dmi/WinterSchool2020DoesAmazonknowyourWealth).
* [Amazon’s Choice: An inquiry into Amazon](https://wiki.digitalmethods.net/Dmi/WinterSchool2020amazonschoice).

# A Master thesis

{{<resource
	kind="paper"
	title="Warehouse of information: Amazon's data collection practices and their relation to GDPR"
	when="September"
	nature="external"
	author="Dimitri Koehorst (UvA master thesis)"
	authorLink="https://duckduckgo.com/?q=dimitri+koehorst+uva+amazon+algorithm+analysis"
	description="In recent times, data has become increasingly central to a variety of different companies. While the use of data has become widespread, there are some companies whose entire business model revolves around the use of data. One  such company is Amazon. Initially it was merely an online bookstore, but as the company grew it incorporated multiple new branches, such as Amazon Web Services, which allow the company to collect data from a variety of different sources. C ompanies such as Amazon use this data to optimize their services, which allows them to gain certain advantages over their competitors. However, this usage of data is bound by international regulations, one of which is the GDPR, the new data  protection legislation of the European Union. By using data collected from the Amazon.com webstore as a case study, this thesis investigates the shift of companies towards a data-oriented business model, and investigates certain problems t hat this shift brings. This is done through the research question: How can we conceptualize the data collection practices of Amazon in relation to the General Data Protection Regulation?"
	href="https://github.com/tracking-exposed/presentation/blob/master/Dimitri%20Koehorst%20Master%20Thesis%20Final%20Version.pdf" >}}


# Or, check it out, our first experimental report

Used as part of a Italian television documentary, [Amazon algorithm analysis and impact assessment](https://github.com/tracking-exposed/presentation/blob/master/amazon.tracking.exposed%20-%20English%20short%20report%20%20-%20Version%204.pdf).

# Google Html Parser

Google Html Parser can parse google results pages to extract organic results, AdWords and
Shopping Ads.

## Features

* Parse Google Adwords in Google Search html snapshots
* Parse organic results with title and description
* Extract Ads with title, content, destination urls as text
* Extract Shopping ads with images and target link
* Can parse mobile pages
* Back to the future parsing old page from 2016 ...
* Use cheerio

## Usage

```
const GoogleHtmlParser = require('google-html-parser');

let options = {};
GoogleHtmlParser.parse(options, '<html>Your Google snapshot</html>', function(err, extractedDatas){
  console.log(extractedDatas);
});

GoogleHtmlParser.parse(options, '<html>Your Google snapshot</html>')
.then(parsedDatas => {
  console.log(parsedDatas);
});

```


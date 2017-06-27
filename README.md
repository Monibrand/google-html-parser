# Google Html Parser

## Features

* Parse Google Adwords in Google Search html snapshots
* Extract Ads with title, content, destination urls as text
* Extract Shopping ads with images and target link
* Can parse mobile pages
* Use cheerio

## Usage

```
const GoogleHtmlParser = require('google-html-parser');

let options = {};
GoogleHtmlParser.parse(options, '<html>Your Google snapshot</html>', function(err, extractedDatas){
  console.log(extractedDatas);
});

```

## Options

* `tryMobile` false || true


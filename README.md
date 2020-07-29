# SERP Html Parser

SERP Html Parser can parse Google and Bing results pages to extract organic results, Ads and
Shopping Ads.

## Features

* Parse Google SERP
* Parse Bing SERP
* Parse organic results with title and description
* Extract Ads with title, content, target urls
* Extract Shopping ads with images and target link
* Can parse mobile pages
* Back to the future parsing old page from 2016 ...
* Use cheerio under the hood

## Usage

```javascript
const GoogleHtmlParser = require('google-html-parser');

let options = {
  searchEngine: 'google', // or bing
  detectText: ['Annonce', 'Ad', 'Annonce·', 'Ad·'] // You can add some other language for re-count feature
};
GoogleHtmlParser.parse(options, '<html>Your Google snapshot</html>', function(err, extractedDatas){
  console.log(extractedDatas);
});

GoogleHtmlParser.parse(options, '<html>Your Google snapshot</html>')
.then(parsedDatas => {
  console.log(parsedDatas);
});

```


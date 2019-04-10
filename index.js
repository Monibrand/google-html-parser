const cheerio = require('cheerio');
const _ = require('lodash');
const Promise = require('bluebird');
const google = require('./modules/google.js');
const bing = require('./modules/bing.js')

function getParser (searchEngine, dom) {
  return new {
    google: google.GoogleParser,
    bing: bing.BingParser,
  }[searchEngine](dom);
}

function parse(options, body, callback){
  options = _.defaultsDeep(options, {
    detectText: ['Annonce', 'Ad']
  });
  var $ = cheerio.load(body);
  var ads = [];
  var position = 1;
  var results = [];
  var realPosition = 1;
  const parser = getParser(options.searchEngine || 'bing', $);

  parser.getNodeList().each(function(){
    parser.setCurrentNode(this);

    if (parser.isAdNode()) {
      var ad = {
        title: parser.getAdTitle(),
        displayUrl: parser.getAdDisplayUrl(),
        targetUrl: parser.getAdTargetUrl(),
      };

      var content = [];
      if (parser.findAdEllipsisChild()) {
        parser.findAdEllipsisChild().remove();
      }
      parser.getAdEllipsis().each(function(){
        content.push($(this).text());
      });

      ad.content = content.join('\n');

      if (parser.getAdPreconnectUrl()) {
        ad.preconnectUrls = parser.getAdPreconnectUrl().split(',');
      }
      ad.position = position++;
      if (parser.isAdOnTop()) {
        ad.area = 'top';
      }
      if (parser.isAdOnBottom()) {
        ad.area = 'bottom';
      }
      ad.realPosition = realPosition++;
      ads.push(ad);
    } else {
      var result = {
        title: parser.getResultTitle(),
        targetUrl: parser.getResultTargetUrl(),
        description: parser.getResultDescription(),
        realPosition: realPosition
      };
      if (result.title && !/\/search\?/.test(result.targetUrl)) {
        results.push(result);
        realPosition++;
      }
    }
  });

  var detectRule = _.chain(options.detectText).map(function(text){
    return _.template('span:contains("<%= text %>")')({text: text});
  }).join(', ').value();
  var adsCount = 0, test = $(detectRule);
  test.each(function(){
    if(options.detectText.indexOf($(this).text()) >= 0 ){
      adsCount++;
    }
  });

  var shoppingAds = [];
  parser.getShopAdList().each(function(){
    parser.setCurrentNode(this);

    // This is parse old 2016 multilines shopping ads
    var title = [];
    parser.getShopAdTitles().each(function(){
      if($(this).text()){
        title.push($(this).text());
      }
    });

    var shoppingAd = {
      title: title.join('\n') || parser.getShopAdTitle(),
      price: parser.getShopAdPrice(),
      advertiser: parser.getShopAdAdvertiser(),
      targetUrl: parser.getShopAdTargetUrl(),
      image: parser.getShopAdImage(),
      discountText: parser.getShopAdDiscountText() || undefined
    };

    shoppingAds.push(shoppingAd);
  });

  var location = {
  };

  if (parser.getLocationCountry()) {
    location.country = parser.getLocationCountry();
  }
  if (parser.getLocationLanguage()) {
    location.htmlLang = parser.getLocationLanguage();
  }
  if(parser.getLocationRegion()){
    location.region = parser.getLocationRegion();
  }

  return Promise.resolve({
    ads : ads,
    adsCount: adsCount,
    shoppingAds: shoppingAds,
    results: results,
    location: (location.country || location.region || location.htmlLang) ? location : undefined,
  }).asCallback(callback);
}

module.exports.parse = parse;

const cheerio = require('cheerio');
const _ = require('lodash');
const Promise = require('bluebird');

function parse(options, body, callback){
  options = _.defaultsDeep(options, {
    detectText: ['Annonce', 'Ad']
  });
  var $ = cheerio.load(body);
  var ads = [];
  var position = 1;
  var results = [];
  var realPosition = 1;

  $('.ads-ad, #ires .g, .ZINbbc.xpd').each(function(){
    var adNode = $(this);
    if(adNode.hasClass('ads-ad')){
      var ad = {
        title: adNode.find('h3').first().text(),
        displayUrl: adNode.find('.ads-visurl cite').text(),
        targetUrl: adNode.find('h3 a, .ad_cclk > a').next('a').attr('href') || adNode.find('> a').attr('href')
      };

      var content = [];
      adNode.find('.ellip .g-bblc').remove();
      adNode.find('div.ads-creative, div.ellip').each(function(){
        content.push($(this).text());
      });

      ad.content = content.join('\n');

      if(adNode.find('h3 a, .ad_cclk > a').next('a').attr('data-preconnect-urls')){
        ad.preconnectUrls = adNode.find('h3 a, .ad_cclk > a').next('a').attr('data-preconnect-urls').split(',');
      }
      ad.position = position++;
      if(adNode.parents('#taw').length > 0){
        ad.area = 'top';
      }
      if(adNode.parents('#bottomads').length > 0){
        ad.area = 'bottom';
      }
      ad.realPosition = realPosition++;
      ads.push(ad);
    }else{
      var result = {
        title: $(this).find('a div').first().text() || $(this).find('a').first().text(),
        targetUrl: $(this).find('a').attr('href'),
        description: $(this).find('.st').text() || $(this).find('div.JTuIPc > .pIpgAc').text(),
        realPosition: realPosition
      };
      if(result.title && !/\/search\?/.test(result.targetUrl)){
        realPosition++;
        results.push(result);
      }
    }
  });

  console.log(results);

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
  $('.pla-unit:has(img)').each(function(){
    var plaNode = $(this);

    // This is parse old 2016 multilines shopping ads
    var title = [];
    plaNode.find('.pla-unit-title span').each(function(){
      if($(this).text()){
        title.push($(this).text());
      }
    });

    var shoppingAd = {
      title: title.join('\n') || plaNode.find('.pla-unit-title, h4').text(),
      price: plaNode.find('._pvi, ._XJg, ._EPg').text(),
      advertiser: plaNode.find('._mC, ._FLg, cite').text(),
      targetUrl: plaNode.find('.pla-unit-title-link, > a').attr('href') || plaNode.attr('href'),
      image: plaNode.find('img').attr('src'),
      discountText: plaNode.find('._zHp, ._gti').text() || undefined
    };

    shoppingAds.push(shoppingAd);
  });

  var location = $('#swml_addr').text() || undefined;

  return Promise.resolve({ ads : ads, adsCount: adsCount, shoppingAds: shoppingAds, results: results, location: location }).asCallback(callback);
}

module.exports.parse = parse;

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

  $('.ads-ad, #ires .g, .ZINbbc.xpd, .O9g5cc.xpd').each(function(){
    var adNode = $(this);
    if(adNode.hasClass('ads-ad') || adNode.parents('[class^=\'ads-\'],[class*=\' ads-\']').length > 0){
      var ad = {
        title: adNode.find('h3, .cfxYMc').first().text(),
        displayUrl: adNode.find('.ads-visurl cite, .qzEoUe').text(),
        targetUrl: adNode.find('h3 a, .ad_cclk > a').next('a').attr('href') || adNode.find('> a').attr('href') || adNode.find('h3 a, > div > a').attr('href')
      };

      var content = [];
      adNode.find('.ellip .g-bblc').remove();
      adNode.find('div.ads-creative, div.ellip, div:nth-child(3) .lEBKkf').each(function(){
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
        description: $(this).find('.st').text() || $(this).find('div.JTuIPc > .pIpgAc, [jsname="ao5mud"] .BmP5tf > .MUxGbd , hr + .BmP5tf > .MUxGbd').text(),
        realPosition: realPosition
      };
      if(result.title && !/\/search\?/.test(result.targetUrl)){
        realPosition++;
        results.push(result);
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
      price: plaNode.find('._pvi, ._XJg, ._EPg, .e10twf.T4OwTb').text(),
      advertiser: plaNode.find('._mC, ._FLg, cite,.VZqTOd').text(),
      targetUrl: plaNode.find('.pla-unit-title-link, > a').attr('href') || plaNode.attr('href'),
      image: plaNode.find('img').attr('src'),
      discountText: plaNode.find('._zHp, ._gti').text() || undefined
    };

    shoppingAds.push(shoppingAd);
  });

  var location = {
  };

  if($('.Q8LRLc').text()){
    location.country = $('.Q8LRLc').text();
  }
  if($('html').attr('lang')){
    location.htmlLang = $('html').attr('lang');
  }
  if($('#swml_addr, #swml-loc').text()){
    location.region = $('#swml_addr, #swml-loc').text();
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

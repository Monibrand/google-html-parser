var cheerio = require('cheerio');
var _ = require('lodash');

function parse(options, body, callback){
  options = _.defaultsDeep(options, {
    detectText: ['Annonce', 'Ad']
  });
  var $ = cheerio.load(body);
  var ads = [];
  var position = 1;
  $('.ads-ad').each(function(){
    var adNode = $(this);
    var ad = {
      title: adNode.find('h3').first().text(),
      displayUrl: adNode.find('.ads-visurl cite').text(),
      targetUrl: adNode.find('h3 a, .ad_cclk > a').next('a').attr('href')
    };

    var content = [];
    adNode.find('.ellip .g-bblc').remove();
    adNode.children('.ellip').each(function(){
      content.push($(this).text());
    });

    if(options.tryMobile){
      adNode.find('div.ads-creative, div.ellip').each(function(){
        content.push($(this).text());
      });
    }

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
    ads.push(ad);
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
    var shoppingAd = {
      title: plaNode.find('.pla-unit-title').text(),
      price: plaNode.find('._pvi').text(),
      subtitle: plaNode.find('._mC').text(),
      targetUrl: plaNode.find('.pla-unit-title-link').attr('href'),
      image: plaNode.find('.pla-unit-img-container img').attr('src')
    };
    shoppingAds.push(shoppingAd);
  });
  callback(null, { ads : ads, adsCount: adsCount, shoppingAds: shoppingAds });
}

module.exports.parse = parse;

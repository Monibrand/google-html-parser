var cheerio = require('cheerio');
var _ = require('lodash');

function parse(options, body, callback){
  options = _.defaultsDeep(options, {
    detectText: ['Annonce', 'Ads']
  });
  var $ = cheerio.load(body);
  var ads = [];
  var position = 1;
  $('.ads-ad').each(function(){
    var adNode = $(this);
    var ad = {
      title: adNode.children('h3').text(),
      content: adNode.children('.ads-creative').text() + '\n' + adNode.children('.ads-creative').next('div').text(),
      displayUrl: adNode.find('.ads-visurl cite').text(),
      targetUrl: adNode.find('h3 a').next('a').attr('href')
    };
    if(adNode.find('h3 a').next('a').attr('data-preconnect-urls')){
      ad.preconnectUrls = adNode.find('h3 a').next('a').attr('data-preconnect-urls').split(',');
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
    return _.template(':contains("<%= text %>")')({text: text});
  }).join(', ').value();
  var adsCount = 0, test = $(detectRule);
  test.each(function(){
    if(options.detectText.indexOf($(this).text()) >= 0 ){
      adsCount++;
    }
  });
  callback(null, { ads : ads, adsCount: adsCount });
}

module.exports.parse = parse;

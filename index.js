var cheerio = require('cheerio');
var _ = require('lodash');

function parse(options, body, callback){
  options = _.defaultsDeep(options, {
    detectText: ['Annonce', 'Ads']
  });
  var $ = cheerio.load(body);
  var ads = [];
  $('.ads-ad').each(function(){
    var adNode = $(this);
    ads.push({
      title: adNode.children('h3').text(),
      content: adNode.children('.ads-creative').text() + '\n' + adNode.children('.ads-creative').next('div').text(),
      displayUrl: adNode.find('.ads-visurl cite').text(),
      targetUrl: adNode.find('h3 a').next('a').attr('href')
    });
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

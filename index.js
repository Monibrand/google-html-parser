var cheerio = require('cheerio');

function parse(options, body, callback){
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
  callback(null, { ads : ads });
}

module.exports.parse = parse;

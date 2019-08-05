const GoogleHtmlParser = require('..');
const _ = require('lodash');
const assert = require('assert');
const fs = require('fs');


describe('GoogleHtmlParser', function() {
  getMocks().forEach(mock => {
    describe('Extract and compare test for ' + mock.name, function(){
      let extractedDatas;
      before(function(){
        if(mock.name.match(/bing/g) != null){
          var searchEngine = 'bing';
        }else{
          var searchEngine = 'google';
        }
        return GoogleHtmlParser.parse({'searchEngine': searchEngine}, mock.html).then(parsedDatas => {
          extractedDatas = parsedDatas;
        });
      });

      it('Counting ads', function(){
        assert.strictEqual(extractedDatas.ads.length, mock.data.ads.length, 'Ads length doesn\'t match.');
        assert.strictEqual(extractedDatas.adsCount, mock.data.adsCount, 'Ads alternative count doesn\'t match.');
        assert.strictEqual(extractedDatas.adsCount, mock.data.ads.length, 'Ads alternative count doesn\'t match with ads length.');
        assert.deepStrictEqual(extractedDatas.location, mock.data.location, 'Location is wrong');
      });

      mock.data.ads.forEach((adMock, i) => {
        it('Verify datas for ad ' + adMock.title + ' (' + i + ')', function(){
          assert.strictEqual(extractedDatas.ads[i].position, adMock.position);
          assert.strictEqual(extractedDatas.ads[i].realPosition, adMock.realPosition);
          assert.strictEqual(extractedDatas.ads[i].area, adMock.area);
          assert.strictEqual(extractedDatas.ads[i].title, adMock.title);
          assert.strictEqual(extractedDatas.ads[i].content, adMock.content);
          assert.strictEqual(extractedDatas.ads[i].displayUrl, adMock.displayUrl);
          assert.strictEqual(extractedDatas.ads[i].targetUrl, adMock.targetUrl);
          if(adMock.preconnectUrls){
            adMock.preconnectUrls.forEach((preconnectUrlMock, j) => {
              assert.strictEqual(extractedDatas.ads[i].preconnectUrls[j], preconnectUrlMock);
            });
          }
        });
      });

      mock.data.shoppingAds.forEach((shoppingAdMock, i) => {
        it('Verify datas for shopping ad ' + shoppingAdMock.title + ' (' + i + ')', function(){
          assert.strictEqual(extractedDatas.shoppingAds[i].title, shoppingAdMock.title);
          assert.strictEqual(extractedDatas.shoppingAds[i].advertiser, shoppingAdMock.advertiser);
          assert.strictEqual(extractedDatas.shoppingAds[i].targetUrl, shoppingAdMock.targetUrl);
          assert.strictEqual(extractedDatas.shoppingAds[i].image, shoppingAdMock.image);
          assert.strictEqual(extractedDatas.shoppingAds[i].price, shoppingAdMock.price);
          assert.strictEqual(extractedDatas.shoppingAds[i].discountText, shoppingAdMock.discountText);
          assert.strictEqual(extractedDatas.shoppingAds[i].comparatorUrl, shoppingAdMock.comparatorUrl);
          assert.strictEqual(extractedDatas.shoppingAds[i].comparatorName, shoppingAdMock.comparatorName);
        });
      });

      it('Counting results', function(){
        assert.strictEqual(extractedDatas.results.length, mock.data.results.length, 'Results length doesn\'t match.');
      });

      mock.data.results.forEach((result, i) => {
        it('Verify datas for result ' + result.title + ' (' + i + ')', function(){
          assert.strictEqual(extractedDatas.results[i].title, result.title);
          assert.strictEqual(extractedDatas.results[i].targetUrl, result.targetUrl);
          assert.strictEqual(extractedDatas.results[i].description, result.description);
        });
      });
    });
  });
});

function getMocks(){
  let mocks = [];
  let mocksNames = fs.readdirSync(__dirname + '/mocks');
  _.filter(mocksNames, function(mockName){
    return /\.html$/.test(mockName);
  }).sort().forEach(function(mockName){
    let cutName = /(.*)\.html$/.exec(mockName);
    let dataFileName = cutName[1] + '-data.json';
    mocks.push({ name: mockName, data: require(__dirname + '/mocks/' + dataFileName), html: fs.readFileSync(__dirname + '/mocks/' + mockName) });
  });
  return mocks;
}

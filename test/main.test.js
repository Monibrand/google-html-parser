const GoogleHtmlParser = require('..');
const _ = require('lodash');
const assert = require('assert');
const fs = require('fs');


describe('GoogleHtmlParser', function() {
  describe('Parse tests', function() {
    getMocks().forEach(mock => {
      it('Extract and compare test for ' + mock.name, function(){
        return GoogleHtmlParser.parse({}, mock.html).then(extractedDatas => {
          assert.strictEqual(extractedDatas.ads.length, mock.data.ads.length, 'Ads length doesn\'t match.');
          assert.strictEqual(extractedDatas.adsCount, mock.data.adsCount, 'Ads alternative count doesn\'t match.');
          mock.data.ads.forEach((adMock, i) => {
            assert.strictEqual(extractedDatas.ads[i].position, adMock.position);
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
          mock.data.shoppingAds.forEach((shoppingAdMock, i) => {
            assert.strictEqual(extractedDatas.shoppingAds[i].title, shoppingAdMock.title);
            assert.strictEqual(extractedDatas.shoppingAds[i].advertiser, shoppingAdMock.advertiser);
            assert.strictEqual(extractedDatas.shoppingAds[i].targetUrl, shoppingAdMock.targetUrl);
            assert.strictEqual(extractedDatas.shoppingAds[i].image, shoppingAdMock.image);
            assert.strictEqual(extractedDatas.shoppingAds[i].price, shoppingAdMock.price);
            assert.strictEqual(extractedDatas.shoppingAds[i].discountText, shoppingAdMock.discountText);
          });
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

var GoogleHtmlParser = require('..');
var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');


describe('GoogleHtmlParser', function() {
  describe('Parse tests', function() {
    it('Extract google ads', function(done){
      GoogleHtmlParser.parse({}, getMock('mock1'), function(err, extractedDatas){
        assert.strictEqual(extractedDatas.ads.length, 6);
        assert.equal(extractedDatas.adsCount, 6);
        extractedDatas.ads.forEach(function(ad){
          // Test field presence for each ads
          assert.strictEqual(_.chain(ad).keys().difference(['title', 'content', 'displayUrl', 'targetUrl', 'preconnectUrls', 'position', 'area']).value().length, 0, '');
        });
        done(err);
      });
    });
    it('Ads have good position.', function(done){
      GoogleHtmlParser.parse({}, getMock('mock1'), function(err, extractedDatas){
        assert.strictEqual(extractedDatas.ads[0].position, 1);
        assert.strictEqual(extractedDatas.ads[1].position, 2);
        assert.strictEqual(extractedDatas.ads[2].position, 3);
        assert.strictEqual(extractedDatas.ads[0].area, 'top');
        assert.strictEqual(extractedDatas.ads[1].area, 'top');
        assert.strictEqual(extractedDatas.ads[2].area, 'top');
        assert.strictEqual(extractedDatas.ads[3].position, 4);
        assert.strictEqual(extractedDatas.ads[4].position, 5);
        assert.strictEqual(extractedDatas.ads[5].position, 6);
        assert.strictEqual(extractedDatas.ads[3].area, 'bottom');
        assert.strictEqual(extractedDatas.ads[4].area, 'bottom');
        assert.strictEqual(extractedDatas.ads[5].area, 'bottom');
        done(err);
      });
    });
    it('Detect if missing ads mock2.', function(done){
      GoogleHtmlParser.parse({}, getMock('mock2'), function(err, extractedDatas){
        assert.strictEqual(extractedDatas.ads.length, 3);
        assert.equal(extractedDatas.adsCount, 3);
        done(err);
      });
    });
  });
});


function getMock(name){
  var mocksNames = fs.readdirSync(__dirname + '/mocks');
  return fs.readFileSync(__dirname + '/mocks/' + _.last(_.filter(mocksNames, function(mocksName){
    return (mocksName.indexOf(name) === 0);
  }).sort()));
}

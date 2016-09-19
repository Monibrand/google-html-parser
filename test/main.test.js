var GoogleHtmlParser = require('..');
var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');


describe('GoogleHtmlParser', function() {
  describe('Parse tests', function() {
    it('Extract google ads', function(done){
      GoogleHtmlParser.parse({}, getMock('mock1'), function(err, extractedDatas){
        //console.log(extractedDatas);
        assert.strictEqual(extractedDatas.ads.length, 6);
        assert.equal(extractedDatas.adsCount, 6);
        extractedDatas.ads.forEach(function(ad){
          assert.strictEqual(_.chain(ad).keys().difference(['title', 'content', 'displayUrl', 'targetUrl']).value().length, 0, '');
        });
        done(err);
      });
    });
    it('Detect if missing ads', function(done){
      GoogleHtmlParser.parse({}, getMock('mock2'), function(err, extractedDatas){
        assert.strictEqual(extractedDatas.ads.length, 5);
        assert.equal(extractedDatas.adsCount, 6);
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

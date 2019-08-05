const GoogleHtmlParser = require('../..');
const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));


let selectRegExp = new RegExp( '.*' + (argv.g || '') +  '.*\\.html$');
let mocksNames = fs.readdirSync(__dirname);
let mocksToPreGenerate = _.filter(mocksNames, function(mocksName){
  return selectRegExp.test(mocksName);
}).sort();
Promise.map(mocksToPreGenerate, filename => {
  if(filename.match(/bing/g) != null){
    var searchEngine = 'bing';
  }else{
    var searchEngine = 'google';
  }
  return GoogleHtmlParser.parse({'searchEngine' : searchEngine}, fs.readFileSync(__dirname + '/' + filename))
    .then(extractedDatas => {
      var extractName = /(.*)\.html$/.exec(filename);
      fs.writeFileSync( __dirname + '/' + extractName[1] + '-data.json', JSON.stringify(extractedDatas,null,2));
      console.log('%s has been updated.', extractName[1] + '-data.json');
    });
}).then(() => {
  console.log('Pre-generate mock data done. YOU NEED TO CHECK MANUALLY ALL mock-data.json FILE !');
})

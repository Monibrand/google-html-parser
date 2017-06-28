const GoogleScraper = require('google-search-scraper');
const GoogleHtmlParser = require('../..');
const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));

var mocksQueries = {
  'mock1': {query : 'lacoste pas cher'}
};

// --getmocks
if(argv.getmocks){
  Promise.map(mocksQueries, function(conf, index, size){
    console.log(conf, index, size);
    return GoogleScraper.search({ query: conf.query, limit: 1 , keepPages: true })
    .then(result => {
      fs.writeFileSync( __dirname + '/' + name + ' ' + (new Date()).toISOString() + '.html', result.pages[0]);
    });
  });
}

// --pregeneratedata
if(argv['pregeneratedata']){
  let selectRegExp = new RegExp( '.*' + (argv.g || '') +  '.*\\.html$');
  let mocksNames = fs.readdirSync(__dirname);
  let mocksToPreGenerate = _.filter(mocksNames, function(mocksName){
    return selectRegExp.test(mocksName);
  }).sort();
  Promise.map(mocksToPreGenerate, filename => {
    return GoogleHtmlParser.parse({}, fs.readFileSync(__dirname + '/' + filename))
    .then(extractedDatas => {
      var extractName = /(.*)\.html$/.exec(filename);
      fs.writeFileSync( __dirname + '/' + extractName[1] + '-data.json', JSON.stringify(extractedDatas,null,2));
      console.log('%s has been updated.', extractName[1] + '-data.json');
    });
  }).then(() => {
    console.log('Pre-generate mock data done. YOU NEED TO CHECK MANUALLY ALL mock-data.json FILE !');
  })
}

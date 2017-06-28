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
  var mocksNames = fs.readdirSync(__dirname);
  var mocksToPreGenerate = _.filter(mocksNames, function(mocksName){
    return /\.html$/.test(mocksName);
  }).sort();
  Promise.map(mocksToPreGenerate, filename => {
    return GoogleHtmlParser.parse({}, fs.readFileSync(__dirname + '/' + filename))
    .then(extractedDatas => {
      var extractName = /(.*)\.html$/.exec(filename);
      fs.writeFileSync( __dirname + '/' + extractName[1] + '-data.json', JSON.stringify(extractedDatas,null,2));
    });
  }).then(() => {
    console.log('Done !');
  })
}

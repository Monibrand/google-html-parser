var GoogleScraper = require('google-search-scraper');
var fs = require('fs');
var async = require('async');

var mocksQueries = {
  'mock1': {query : 'lacoste pas cher'}
};

// TODO Use promise in place of async
async.forEachOf(mocksQueries, function(conf, name, done){
  GoogleScraper.search({ query: conf.query, limit: 1 , keepPages: true }, function(err, result){
    if(err){
      throw err;
    }
    fs.writeFileSync( __dirname + '/' + name + ' ' + (new Date()).toISOString() + '.html', result.pages[0]);
    //TODO Create a json file containing ads for each mock
    done();
  });
});

var GoogleScraper = require('../../google-scraper');
var fs = require('fs');
var async = require('async');

var mocksQueries = {
  'mock1': {query : 'lacoste pas cher'}
};

async.forEachOf(mocksQueries, function(conf, name, done){
  GoogleScraper.search({ query: conf.query, limit: 1 , keepPages: true }, function(err, result){
    if(err){
      throw err;
    }
    fs.writeFileSync( __dirname + '/mocks/' + name + ' ' + (new Date()).toISOString() + '.html', result.pages[0]);
    done();
  });
});

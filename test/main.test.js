var GoogleHtmlParser = require('..');
var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');


describe('GoogleHtmlParser', function() {
  describe('Parse tests', function() {
    it('Extract google ads', function(done){
      GoogleHtmlParser.parse({}, getMock('mock1'), function(err, extractedDatas){
        assert.strictEqual(extractedDatas.ads.length, 6);
        assert.strictEqual(extractedDatas.adsCount, 6);
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
    it('Detect if missing ads mock3.', function(done){
      GoogleHtmlParser.parse({}, getMock('mock3'), function(err, extractedDatas){
        assert.strictEqual(extractedDatas.ads[0].position, 1);
        assert.strictEqual(extractedDatas.ads[0].area, 'top');
        assert.strictEqual(extractedDatas.ads[0].title, 'Crédit Cofidis - Simulation de Crédit Gratuite‎');
        assert.strictEqual(extractedDatas.ads[0].content, 'Empruntez jusqu\'à 6000€ aujourd\'hui et obtenez une Réponse de Principe Immédiate');
        assert.strictEqual(extractedDatas.ads[0].displayUrl, 'www.cofidis.fr/Crédit/Consommation');
        assert.strictEqual(extractedDatas.ads[0].targetUrl, 'https://www.cofidis.fr/fr/credit_en_ligne/simulateur-credits.html');
        assert.strictEqual(extractedDatas.ads[0].preconnectUrls[0], 'https://www.cofidis.fr/');
        assert.strictEqual(extractedDatas.ads[0].preconnectUrls[1], 'http://cofidis2.solution.weborama.fr/');
        assert.strictEqual(extractedDatas.ads.length, 1);
        assert.strictEqual(extractedDatas.adsCount, 1, 'Ads count doesn\'t match.');
        done(err);
      });
    });
    it('Ads and shopping extract from mock4', function(done){
      GoogleHtmlParser.parse({}, getMock('mock4'), function(err, extractedDatas){
        assert.strictEqual(extractedDatas.ads.length, 2);
        assert.strictEqual(extractedDatas.adsCount, 2, 'Ads count doesn\'t match.');

        assert.strictEqual(extractedDatas.ads[0].position, 1);
        assert.strictEqual(extractedDatas.ads[0].area, 'top');
        assert.strictEqual(extractedDatas.ads[0].title, 'Polos Lacoste 2017 - Lacoste Site Officiel - lacoste.com‎');
        assert.strictEqual(extractedDatas.ads[0].content, 'Commandez sur le Site Officiel et Bénéficiez D\'Avantages Exclusifs. Commandez\nLivraison en 48h · Paiement Sécurisé · SAV : Mail ou Téléphone · Retour Facile et Gratuit\nAubervilliers‎ - 01 41 61 04 03‎ - Ouvert aujourd\'hui · 10:00 – 20:00');
        assert.strictEqual(extractedDatas.ads[0].displayUrl, 'www.lacoste.com/Site_Officiel/Polos');
        assert.strictEqual(extractedDatas.ads[0].targetUrl, 'http://www.lacoste.com/fr/les-polos/tous-les-polos/');
        assert.strictEqual(extractedDatas.ads[0].preconnectUrls[0], 'http://www.lacoste.com/');
        assert.strictEqual(extractedDatas.ads[0].preconnectUrls[1], 'https://ad.atdmt.com/');

        assert.strictEqual(extractedDatas.ads[1].position, 2);
        assert.strictEqual(extractedDatas.ads[1].area, 'bottom');
        assert.strictEqual(extractedDatas.ads[1].title, 'Collection Printemps/Été 2017 - Nouveautés en Ligne‎');
        assert.strictEqual(extractedDatas.ads[1].content, 'Nouveautés sur vos Marques Favorites avec MSR. Livraison et Retour Gratuits\nMarques: Sessun, Vero Moda, Pieces\nTypes: Femme, Homme, Enfant, Déco');
        assert.strictEqual(extractedDatas.ads[1].displayUrl, 'www.monshowroom.com/Lacoste/Nouveautés');
        assert.strictEqual(extractedDatas.ads[1].targetUrl, 'https://www.monshowroom.com/fr/products/marques-femme/lacoste');
        assert.strictEqual(extractedDatas.ads[1].preconnectUrls[0], 'https://www.monshowroom.com/');

        assert.strictEqual(extractedDatas.shoppingAds.length, 24, 'Shopping ads count doesn\'t match.');
        require('./mocks/mock4-data').forEach(function(mockAdData, i){
          assert.strictEqual(extractedDatas.shoppingAds[i].title, mockAdData.title);
          assert.strictEqual(extractedDatas.shoppingAds[i].subtitle, mockAdData.subtitle);
          assert.strictEqual(extractedDatas.shoppingAds[i].price, mockAdData.price);
          assert.strictEqual(extractedDatas.shoppingAds[i].targetUrl, mockAdData.targetUrl);
          assert.strictEqual(extractedDatas.shoppingAds[i].image, mockAdData.image);
        });
        done(err);
      });
    });
    it('Ads and shopping extract from mockmobile1', function(done){
      GoogleHtmlParser.parse({}, getMock('mockmobile1'), function(err, extractedDatas){
        console.log(extractedDatas);
        done(err);
      });
    });
  });
});


function getMock(name){
  var matchRegExp = new RegExp('^' + name + '.*\\.html');
  var mocksNames = fs.readdirSync(__dirname + '/mocks');
  return fs.readFileSync(__dirname + '/mocks/' + _.last(_.filter(mocksNames, function(mocksName){
    return matchRegExp.test(mocksName);
  }).sort()));
}

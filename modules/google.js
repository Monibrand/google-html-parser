const _ = require('lodash')

class GoogleParser {

    constructor(dom) {
        this.$ = dom;
        this.adNode = null;
    }

    setCurrentNode(node) {
        this.adNode = this.$(node);
    }

    getNodeList() {
        return this.$('.ads-ad, .mnr-c.O9g5cc.uUPGi, #ires .g, .ZINbbc.xpd, .O9g5cc.xpd');
    }

    getAdTitle() {
        return this.adNode.find('h3, .cfxYMc').first().text();
    }

    getAdDisplayUrl() {
        return this.adNode.find('.ads-visurl cite').first().text() || this.adNode.find('.qzEoUe, .dTe0Ie.LrP0oe').text();
    }

    getAdTargetUrl() {
        return this.adNode.find('h3 a, .ad_cclk > a').next('a').attr('href') || this.adNode.find('> a').attr('href') || this.adNode.find('h3 a, > div > a').attr('href');
    }

    getAdEllipsis() {
        return this.adNode.find('div.ads-creative, div.ellip, div:nth-child(3) .lEBKkf, .yDYNvb.lEBKkf, hr + .BmP5tf > .MUxGbd, .HLLkSb.G99wIc.rLshyf');
    }

    getAdPreconnectUrl() {
        return this.adNode.find('h3 a, .ad_cclk > a').next('a').attr('data-preconnect-urls');
    }

    findAdEllipsisChild() {
        return this.adNode.find('.ellip .g-bblc');
    }

    isAdNode() {
        return this.adNode.hasClass('ads-ad') || this.adNode.parents('[class^=\'ads-\'],[class*=\' ads-\']').length > 0;
    }

    isAdOnTop() {
        return this.adNode.parents('#taw').length > 0;
    }

    isAdOnBottom() {
        return this.adNode.parents('#bottomads').length > 0;
    }

    getResultTitle() {
        return this.adNode.find('a div').first().text() || this.adNode.find('a').first().text();
    }

    getResultTargetUrl() {
        return this.adNode.find('a').attr('href');
    }

    getResultDescription() {
        return this.adNode.find('.st').text() ||
            this.adNode.find('div.JTuIPc > .pIpgAc, [jsname="ao5mud"] .BmP5tf > .MUxGbd , hr + .BmP5tf > .MUxGbd, .yDYNvb').text()
    }

    getShopAdList() {
        return this.$('.pla-unit-container:has(img)');
    }

    getShopAdTitles() {
        return this.adNode.find('.pla-unit-title span');
    }

    getShopAdTitle() {
        return this.adNode.find('.pla-unit-title .rhsg4').text() ||
            this.adNode.find('h4, .pla-unit-title-link').text();
    }

    getShopAdPrice() {
        return this.adNode.find('._pvi, ._XJg, ._EPg, .e10twf.T4OwTb').text() ||
            this.adNode.find('.dOp6Sc').contents().first().text();
    }

    getShopAdOriginalPrice() {
        return this.adNode.find('.w8RUcd').contents().first().text();
    }

    getShopAdAdvertiser() {
        return this.adNode.find('._mC, ._FLg, cite, .VZqTOd, .LbUacb .rhsg4, .hBvPxd').text();
    }

    getShopAdTargetUrl() {
        return this.adNode.find('.pla-unit-title-link, > a').attr('href') || this.adNode.find('.pla-unit').attr('href');
    }

    getShopAdImage() {
        return this.adNode.find('.Gor6zc > img').attr('src') || this.adNode.find('._Dkf > img').attr('src');
    }

    getShopAdDiscountText() {
        return this.adNode.find('._zHp, ._gti').text();
    }

    getLocationCountry() {
        return this.$('.Q8LRLc').text();
    }

    getLocationLanguage() {
        return this.$('html').attr('lang');
    }

    getLocationRegion() {
        return this.$('#swml_addr, #swml-loc').text();
    }

    getComparatorUrl(){
        return this.adNode.find('.FfKHB').attr('href');
    }

    getComparatorName(){
        return this.adNode.find('.KbpByd').first().text();
    }

    getAdsCountTemplate(options){
        const self = this;
        var detectRule = _.chain(options.detectText).map(function(text){
            return _.template('span:contains("<%= text %>")')({text: text});
          }).join(', ').value();
          var adsCount = 0, test = self.$(detectRule).not('.evvN5c');
          test.each(function(){
            if(options.detectText.indexOf(self.$(this).text()) >= 0 ){
              adsCount++;
            }
          });
          return adsCount;
    }
}

module.exports = {
    GoogleParser: GoogleParser,
};

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
        return this.$('.ads-ad, #ires .g,  #res .g, .ZINbbc.xpd, .O9g5cc');
    }

    getAdTitle() {
        return this.adNode.find('h3, .cfxYMc').first().text();
    }

    getAdDisplayUrl() {
        return this.adNode.find('.ads-visurl cite').first().text() || this.adNode.find('.qzEoUe, .dTe0Ie.LrP0oe').first().text();
    }

    getAdTargetUrl() {
        const self = this;
        const possibleTargetUrls = this.adNode.find('a').map(function(i, el){return self.$(this).attr('href');}).get();
        return _.find(possibleTargetUrls, (e) => !/^https:\/\/www\.(google|googleadservices)\.|^\/aclk|^javascript:/.test(e)) || possibleTargetUrls[0];
    }

    getAdEllipsis() {
        return this.adNode.find('div.ads-creative, div.ellip, div:nth-child(3) .lEBKkf, .yDYNvb.lEBKkf, hr + .BmP5tf > .MUxGbd, .HLLkSb.G99wIc.rLshyf, .MUxGbd.yDYNvb');
    }

    getAdPreconnectUrl() {
        return this.adNode.find('h3 a, .ad_cclk > a').next('a').attr('data-preconnect-urls');
    }

    findAdEllipsisChild() {
        return this.adNode.find('.ellip .g-bblc');
    }

    getAppAdName() {
        const rawTitle = this.getAdTitle();
        const titleMatch = /^(?:Installer \| )?(.*) (?:-|\|) .*$/
        return rawTitle.match(titleMatch)[1] || rawTitle;
    }

    isAdNode() {
        return this.isAdOnTop() || this.isAdOnBottom();
    }

    isAppStoreAdNode() {
        return (
            this.adNode.find('span:contains("App Store")').length > 0 ||
            this.adNode.find('span:contains("Google Play")').length > 0
        );
    }

    isAdOnTop() {
        return this.adNode.parents('#taw,#KsHht').length > 0;
    }

    isAdOnBottom() {
        return this.adNode.parents('#bottomads,#tadsb').length > 0;
    }

    getResultTitle() {
        return this.adNode.find('h3').first().text() || this.adNode.find('a div').first().text() || this.adNode.find('a').first().text() || this.adNode.find('a').eq(1).text();
    }

    getResultTargetUrl() {
        return this.adNode.find('a[href!="javascript:;"]').attr('href');
    }

    getResultDescription() {
        const self = this;
        return this.adNode.find('.st').text() ||
            this.adNode.find('div.JTuIPc > .pIpgAc, [jsname="ao5mud"] .BmP5tf > .MUxGbd , hr + .BmP5tf > .MUxGbd, .yDYNvb').text() ||
            this.adNode.find('.LZ8hH, .IsZvec').text() ||
            this.adNode.find('.q2WXyd .rLMeW, .q2WXyd tr').map(function(i, el){return self.$(this).text();}).get().join('\n');
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
          var adsCount = 0, test = self.$(detectRule).not('.evvN5c').not('.dc3Trd').not('.NVWord');
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

const _ = require('lodash')
class BingParser {

    constructor(dom) {
        this.$ = dom;
        this.adNode = null;
    }

    setCurrentNode(node) {
        this.adNode = this.$(node);
    }

    getNodeList() {
        return this.$('.sb_adTA, .b_algo, .ad_sc, .ads-fr, .O9g5cc');
    }

    getAdTitle() {
        return this.adNode.find('h2').text();
    }

    getAdDisplayUrl() {
        return this.adNode.find('.b_ad cite').text().trim() ||
          this.adNode.find('.b_adurl a').text().trim() ||
          this.adNode.find('.b_adurl cite, .sb_DispAndDesc cite').text().trim();
    }

    getAdTargetUrl() {
        return this.adNode.find('h2 a').attr('href');
    }

    getAdEllipsis() {
        const cloneNode = this.adNode.clone();
        cloneNode.find('.b_caption .b_adSlug').remove();
        return cloneNode.find('.b_caption p');
    }

    getAdPreconnectUrl() {
        return false;
    }

    findAdEllipsisChild() {
        return false;
    }

    getAppAdName() {
        return null;
    }

    isAppStoreAdNode() {
        return false;
    }

    isAdNode() {
        return (this.adNode.hasClass('sb_adTA') || this.adNode.hasClass('ad_sc')) || this.adNode.hasClass('ads-fr');
    }

    isAdOnTop() {
        return this.adNode.parents('.b_ad:not(.b_adBottom)').length > 0;
    }

    isAdOnBottom() {
        return this.adNode.parents('.b_ad.b_adBottom').length > 0;
    }

    getResultTitle() {
        return this.adNode.find('h2').text();
    }

    getResultTargetUrl() {
        return this.adNode.find('h2 a, .b_algoheader a').attr('href');
    }

    getResultDescription() {
        return this.adNode.find('.b_caption p, .b_snippet p').text();
    }

    getResultContent() {
        return this.adNode.find('.sb_adBrandSidebar .sb_adTextInfo p').text();
    }

    getShopAdList() {
        return this.$('.b_ad .pa_item');
    }

    getShopAdTitles() {
        return this.adNode.find('h3, .pa_title');
    }

    getShopAdTitle() {
        return this.adNode.find('h3').text();
    }

    getShopAdPrice() {
        return this.adNode.find('.pa_price').text();
    }

    getShopAdOriginalPrice() {
        return null;
    }

    getShopAdAdvertiser() {
        return this.adNode.find('cite').text();
    }

    getShopAdTargetUrl() {
        return this.adNode.find('.pa_item > a').first().attr('href');
    }

    getShopAdImage() {
        let rawUrl =  this.adNode.find('img').attr('src');
        let trueUrl = null;
        if (rawUrl && rawUrl.match(/\/th\?/)) {
            trueUrl = `https://www.bing.com${rawUrl}`;
        }
        return trueUrl || rawUrl;
    }

    getShopAdDiscountText() {
        return null;
    }

    getLocationCountry() {
        return this.$('#ftrD_Pays > a').text();
    }

    getLocationLanguage() {
        return this.$('html').attr('lang');
    }

    getLocationRegion() {
        return false;
    }

    getComparatorUrl(){
        return null;
    }

    getComparatorName(){
        return null;
    }

    getAdsCountTemplate(options){

        const self = this;
        
        var detectRule = _.chain(options.detectText).map(function(text){
            return _.template('#b_results span:contains("<%= text %>")')({text: text});
          }).join(', ').value();
        var detectRuleForHighlight = _.chain(options.detectText).map(function(text){
            return _.template('#b_context>li.b_ad .sb_adBrandSidebar .b_adSlug:contains("<%= text %>")')({text: text});
        }).join(', ').value();

          var adsCount = 0, test = self.$(detectRule), testHighlight= self.$(detectRuleForHighlight);

          const eachCount = function(){
            if(options.detectText.indexOf(self.$(this).text()) >= 0 ){
              adsCount++;
            }
          }

          test.each(eachCount);
          testHighlight.each(eachCount);
          
          return adsCount;
    }

    getMerchantId() {
      return this.$('[data-k]').attr('data-k');
    }

    getCatalogId() {
      return this.adNode.find('[data-kvalue]').attr('data-kvalue');
    }
}

module.exports = {
    BingParser: BingParser,
};

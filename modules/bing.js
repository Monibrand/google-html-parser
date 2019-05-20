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
        return this.adNode.find('.b_adurl cite').text();
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
        return this.adNode.find('h2 a').attr('href');
    }

    getResultDescription() {
        return this.adNode.find('.b_caption p').text();
    }

    getShopAdList() {
        return this.$('.b_slidebar .slide:has(img), .b_ad .pa_item');
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

    getShopAdAdvertiser() {
        return this.adNode.find('cite').text();
    }

    getShopAdTargetUrl() {
        return this.adNode.find('.pa_item > a').first().attr('href');
    }

    getShopAdImage() {
        let rawUrl =  this.adNode.find('img').attr('src');
        let trueUrl = null;
        if (rawUrl.match(/\/th\?/)) {
            trueUrl = `https://www.bing.com${rawUrl}`;
        }
        return trueUrl || rawUrl;
    }

    getShopAdDiscountText() {
        return null;
    }

    getLocationCountry() {
        return false;
    }

    getLocationLanguage() {
        return false;
    }

    getLocationRegion() {
        return false;;
    }
}

module.exports = {
    BingParser: BingParser,
};
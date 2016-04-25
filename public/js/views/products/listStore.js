define([
    'backbone',
    'underscore',
    'collections/products',
    'text!templates/product/productStore.html',
    'views/storeList'
], function (Backbone, _, Users, list, StoreList) {
    return StoreList.extend({
        contentType: 'products',
        template   : _.template(list)
    });
});
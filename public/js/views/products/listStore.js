define([
    'backbone',
    'underscore',
    'collections/products',
    'text!templates/product/productStore.html',
    'views/storeList'
], function (Backbone, _, Products, list, StoreList) {
    return StoreList.extend({
        contentType: 'products categories',
        template   : _.template(list)
    });
});
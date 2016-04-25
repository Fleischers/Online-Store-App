define([
    'backbone',
    'underscore',
    'collections/products',
    'text!templates/product/productList.html',
    'views/baseList'
], function (Backbone, _, Users, list, BaseList) {
    return BaseList.extend({
        contentType: 'products',
        template   : _.template(list)
    });
});
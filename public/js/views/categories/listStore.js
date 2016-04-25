define([
    'backbone',
    'underscore',
    'collections/products',
    'text!templates/category/categoryStore.html',
    'views/storeList'
], function (Backbone, _, Users, list, StoreList) {
    return StoreList.extend({
        contentType      : 'categories',
        template: _.template(list)
    });
});
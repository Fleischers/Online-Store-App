define([
    'backbone',
    'underscore',
    'collections/users',
    'text!templates/category/categoryList.html',
    'views/baseList'
], function (Backbone, _, Users, list, BaseList) {
    return BaseList.extend({
        contentType      : 'categories',
        template: _.template(list)
    });
});
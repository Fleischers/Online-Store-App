define([
    'backbone',
    'underscore',
    'collections/users',
    'text!templates/user/userList.html',
    'views/baseList'
], function (Backbone, _, Users, list, BaseList) {
    return BaseList.extend({
        contentType: 'users',
        template   : _.template(list)
    });
});
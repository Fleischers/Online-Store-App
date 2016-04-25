define([
    'backbone',
    'underscore',
    'collections/orders',
    'text!templates/order/orderList.html',
    'views/baseList'
], function (Backbone, _, Orders, list, BaseList) {
    return BaseList.extend({
        contentType: 'orders',
        template   : _.template(list)
    });
});
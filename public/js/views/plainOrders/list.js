define([
    'backbone',
    'underscore',
    'collections/plainOrders',
    'text!templates/order/orderList.html',
    'views/baseList'
], function (Backbone, _, Orders, list, BaseList) {
    return BaseList.extend({
        contentType: 'plainOrders',
        template   : _.template(list)
    });
});
define([
    'backbone',
    'underscore',
    'models/order'
], function (Backbone, _, Order) {
    var prodArr;
    var priceArr;
    var quantityArr;
    var total = 0;
    var userId;
    var id;

    return Backbone.View.extend({

        initialize: function (opt) {
            prodArr = $.jStorage.get('productId');
            priceArr = $.jStorage.get('prices');
            quantityArr = $.jStorage.get('quantity');
            userId = $.jStorage.get('userId');

            if (prodArr == null) {
                alert('Your cart is empty');
                Backbone.history.fragment = '';
                Backbone.history.navigate('#myApp/products', {trigger: true});
            } else {
                for (var i = 0; i < priceArr.length; i++) {
                    total += priceArr[i] * quantityArr[i];
                }

                this.model = new Order({
                    customerInfo : userId,
                    products     : prodArr,
                    itemsQuantity: quantityArr,
                    prices       : priceArr,
                    total        : total
                });

                this.model.urlRoot = '/orders';

                this.model.save(null, {
                    wait   : true,
                    success: function (params) {
                        id = params.attributes.success;
                        console.log('-- Created with id ' + id + ' ----');
                        Backbone.history.fragment = '';
                        Backbone.history.navigate('#myApp/cart/' + id, {trigger: true});
                    },
                    error  : function (model, xhr) {
                        alert(xhr.statusText);
                    }
                });
            }
        }
    });
});

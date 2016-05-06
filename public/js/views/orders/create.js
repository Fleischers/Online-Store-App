define([
    'backbone',
    'underscore',
    'models/order'
], function (Backbone, _, Order) {
    var prodArr;
    var quantityArr;
    var userId;
    var id;

    return Backbone.View.extend({

        initialize: function (opt) {
            prodArr = $.jStorage.get('productId');
            quantityArr = $.jStorage.get('quantity');
            userId = $.jStorage.get('userId');

            if (prodArr == null) {
                alert('Your cart is empty');
                Backbone.history.fragment = '';
                Backbone.history.navigate('#myApp/products', {trigger: true});
            } else {

                this.model = new Order({
                    customerInfo : userId,
                    products     : prodArr,
                    itemsQuantity: quantityArr
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

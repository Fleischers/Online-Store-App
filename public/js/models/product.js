define(['backbone'], function (Backbone) {
    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            name          : '',
            price         : '10000$',
            description   : '',
            statusEnabled : 'false',
            manufacturer  : '',
            avatar        : '/images/products/default.jpg',
            productReviews: []
        },

        parse: function (resp) {
            var date;
            var options;

            if (resp.productReviews) {
                (resp.productReviews).forEach(function (item) {
                    date = new Date(item.created);

                    options = {
                        year : 'numeric',
                        month: 'long',
                        day  : 'numeric'
                    };

                    date = date.toLocaleString('en-US', options);
                    item.created = date;
                });
            }

            return resp;
        },

        validate: function (attrs) {

        },

        urlRoot: function () {
            return '/products'
        },

        initialize: function (options) {

            this.on('invalid', function (model, error) {
                console.log('Invalid model ' + error);
            });

            this.on('change', function () {
                console.log('Model changed');
            });
        }
    });

    return Model;
});

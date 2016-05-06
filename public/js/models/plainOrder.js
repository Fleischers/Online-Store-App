define(['backbone'], function (Backbone) {
    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            products     : [],
            itemsQuantity: []
        },

        parse: function (resp) {
            var recovery=resp.emailSent;
            var recStat;
            var date = new Date(resp.created);
            var options = {
                year  : 'numeric',
                month : 'long',
                day   : 'numeric',
                hour  : '2-digit',
                minute: '2-digit'
            };
            date = date.toLocaleString('en-US', options);
            resp.created = date;
            return resp;
        },

        validate: function (attrs) {

        },

        urlRoot: function () {
            return '/plainOrders'
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


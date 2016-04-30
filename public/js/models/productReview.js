define(['backbone'], function (Backbone) {
    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            description: ''
        },

        urlRoot: function () {
            return '/productReviews'
        },

        parse: function (resp) {
            var date = new Date(resp.created);
            var options = {
                year : 'numeric',
                month: 'long',
                day  : 'numeric'
            };
            date = date.toLocaleString('en-US', options);
            resp.created = date;
            return resp;
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

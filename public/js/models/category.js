define(['backbone'], function (Backbone) {
    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            name       : '',
            description: '',
            image      : '/images/categories/default.jpg'
        },

        parse: function (resp) {
            return resp;
        },

        validate: function (attrs) {

        },

        urlRoot: function () {
            return '/categories'
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

define(['backbone'], function (Backbone) {
    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            firstName: '',
            lastName : '',
            email    : '',
            phone    : '',
            address  : ''
        },

        parse: function (resp) {
            var date = new Date(resp.birthday);
            var options = {
                year : 'numeric',
                month: 'long',
                day  : 'numeric'
            };
            date = date.toLocaleString('en-US', options);
            resp.birthday = date;
            return resp;
        },

        validate: function (attr) {
            /* if (attrs.dateOfBirth) {
             if ((Date.now() - attrs.birthday) < 567648000000) {
             return 'This service is available only for > 18';
             }
             }*/
        },

        urlRoot: function () {
            return '/users'
        },

        initialize: function (options) {

            this.on('invalid', function (model, error) {
                console.log('Invalid model ' + error);
            });

            this.on('change', function () {
                console.log('Model changed');
            });
            this.on('change:firstName', function () {
                console.log('firstName of model changed');
            });
            this.on('change:lastName', function () {
                console.log('last name of model changed');
            })
        }
    });

    return Model;
});



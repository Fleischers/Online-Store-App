define([
    'backbone',
    'underscore',
    'models/user',
    'text!templates/navigation/admin.html'
], function (Backbone, _, User, adminTemplate) {
    var email;
    var password;
    var $thisEl;
    var model;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(adminTemplate),

        events: {
            'click #signInBtn': 'onSignIn'
        },

        initialize: function (opt) {
            this.render();
        },

        onSignIn: function (e) {
            $thisEl = this.$el;

            e.stopPropagation();
            e.preventDefault();

            email = $thisEl.find('#logInMail').val();
            password = $thisEl.find('#logInPass').val();

            this.model = new User({
                email   : email,
                password: password
            });
            model = this.model;

            model.urlRoot = '/users/adminlogin';

            model.save(null, {
                wait    : true,
                validate: false,
                success : function (model) {
                    console.log('-- LoggedIn with id' + model.attributes.success + ' ----');
                    Backbone.history.navigate('#myAdmin/home', {trigger: true});
                },
                error   : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {

            $.ajax({
                url    : 'isAuthAdmin',
                success: function (params) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/home', {trigger: true});
                },
                error  : function (error) {
                    Backbone.history.navigate('#myAdmin', {trigger: true});
                }
            });

            this.$el.html(this.template());
        }
    });
});

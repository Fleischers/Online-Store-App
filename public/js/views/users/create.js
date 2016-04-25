define([
    'backbone',
    'underscore',
    'models/user',
    'text!templates/user/create_login.html'
], function (Backbone, _, User, create) {
    var $thisEl;
    var $target;
    var $div;
    var $smsField;
    var $newDiv;
    var $firstName;
    var $lastName;
    var $email;
    var $password;
    var $phone;
    var id;
    var sms;

    return Backbone.View.extend({
        el      : '#container',
        template: _.template(create),
        events  : {
            'click #fakeloginBtn': 'onFake',
            'click #createBtn'   : 'onSave',
            'click #loginBtn'    : 'onLogin'
        },

        initialize: function (opt) {
            this.channel = opt.channel;
            this.render();
        },

        onFake: function (e) {
            e.stopPropagation();

            $thisEl = this.$el;
            email = $thisEl.find('#logInMail').val();
            $target = $(e.target);
            $div = $target.closest('div');
            $div.hide();
            $smsField = $('div#sms');
            $newDiv = $('div#smsReceived');
            $smsField.show();
            $newDiv.show();

            this.model = new User({
                email: email
            });

            this.model.urlRoot = '/users/sendsms';

            this.model.save(null, {
                wait    : true,
                validate: false,
                success : function () {
                    console.log('-- SMS was sent --');
                },
                error   : function (model, xhr) {
                    alert(xhr.statusText);
                    Backbone.history.navigate('#myApp/users/create', {trigger: true});
                }
            });
        },

        onSave: function (e) {
            e.stopPropagation();
            e.preventDefault();

            $thisEl = this.$el;
            $firstName = $thisEl.find('#firstName').val();
            $lastName = $thisEl.find('#lastName').val();
            $email = $thisEl.find('#email').val();
            $password = $thisEl.find('#password').val();
            $phone = $thisEl.find('#phone').val();

            this.model = new User({
                firstName: $firstName,
                lastName : $lastName,
                email    : $email,
                password : $password,
                phone    : $phone
            });

            this.model.urlRoot = '/users';

            this.model.save(null, {
                wait   : true,
                success: function (model) {
                    id = model.id;
                    email = model.attributes.email;
                    console.log('-- Created with id ' + id + ' ----');
                    alert('Message was sent to ' + email);
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp/users/create', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        onLogin: function (e) {
            $thisEl = this.$el;

            e.stopPropagation();
            e.preventDefault();

            email = $thisEl.find('#logInMail').val();
            password = $thisEl.find('#logInPass').val();
            sms = $thisEl.find('#receivedCode').val();

            this.model = new User({
                email   : email,
                password: password,
                sms     : sms
            });

            this.model.urlRoot = '/users/login';

            this.model.save(null, {
                wait    : true,
                validate: false,
                success : function (model) {
                    console.log(model);
                    console.log(model.attributes.success);
                    console.log('-- LoggedIn with id' + model.attributes.success + ' ----');
                    Backbone.history.navigate('#myApp/users/account/' + model.attributes.success, {trigger: true});
                },
                error   : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {

            $.ajax({
                url    : 'isAuth',
                success: function (params) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp/users/account/' + params.success, {trigger: true});
                },
                error  : function (error) {
                    Backbone.history.navigate('#myApp/users/create', {trigger: true});
                }
            });

            this.$el.html(this.template());
        }
    });
});

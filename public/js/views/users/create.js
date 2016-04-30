define([
    'backbone',
    'underscore',
    'models/user',
    'text!templates/user/create_login.html'
], function (Backbone, _, User, create) {

    return Backbone.View.extend({
        el      : '#container',
        template: _.template(create),

        events: {
            'click #intoLogin'   : 'onShowLogin',
            'click #intoReg'     : 'onShowReg',
            'click #fakeloginBtn': 'onFake',
            'click #createBtn'   : 'onSave',
            'click #loginBtn'    : 'onLogin',
            'click #forgotPass'  : 'onForgotPassPage'
        },

        initialize: function (opt) {
            this.channel = opt.channel;
            this.render();
        },

        onShowLogin: function (e) {
            var $div;
            var $thisEl;
            var $newDiv;

            e.stopPropagation();
            $thisEl = this.$el;
            $div = $('div#chose').hide();
            $newDiv = $('div#logForm').show();
        },

        onShowReg: function (e) {
            var $div;
            var $thisEl;
            var $newDiv;

            e.stopPropagation();
            $thisEl = this.$el;
            $div = $('div#chose').hide();
            $newDiv = $('div#regForm').show();
        },

        onFake: function (e) {
            var $email;
            var $thisEl;
            var $target;
            var $div;
            var $smsField;
            var $newDiv;
            var attributes;
            var err;

            e.stopPropagation();
            $thisEl = this.$el;
            $email = $thisEl.find('#logInMail').val();
            attributes = [];
            err = [];
            attributes.push($email);
            attributes.forEach(function (item) {

                if ((item.search(/<html>/i) != -1) || (item.search(/<script>/i) != -1)) {
                    err.push('Don\'t even think to do smth like this')
                }

                if (item.trim().length === 0) {
                    err.push('This field can\'t be empty.');
                }

                if (item.trim().length > 64) {
                    err.push('This field can\'t be such long.');
                }

                switch (item) {
                    case ($email):
                        if (!$email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                            err.push('Please input a valid email.');
                        }
                        break;
                }
            });
            if (err.length == 0) {
                $target = $(e.target);
                $div = $target.closest('div');
                $div.hide();
                $smsField = $('div#sms');
                $newDiv = $('div#smsReceived');
                $smsField.show();
                $newDiv.show();

                this.model = new User({
                    email: $email
                });

                this.model.urlRoot = '/users/sendsms';

                this.model.save(null, {
                    wait    : true,
                    validate: false,
                    success : function (params) {
                        alert('-- SMS was sent to '+params.attributes.success+' --');
                    },
                    error   : function (model, xhr) {
                        alert(xhr.statusText);
                        Backbone.history.navigate('#myApp/users/create', {trigger: true});
                    }
                });
            } else {
                err.forEach(function (item) {
                    alert(item);
                })
            }
        },

        onSave: function (e) {
            var $firstName;
            var $lastName;
            var $email;
            var $password;
            var $phone;
            var $thisEl;
            var id;
            var email;
            var attributes;
            var err;

            e.stopPropagation();
            e.preventDefault();

            $thisEl = this.$el;
            $firstName = $thisEl.find('#firstName').val();
            $lastName = $thisEl.find('#lastName').val();
            $email = $thisEl.find('#email').val();
            $password = $thisEl.find('#password').val();
            $phone = $thisEl.find('#phone').val();
            attributes = [];
            err = [];
            attributes.push($firstName, $lastName, $email, $password, $phone);
            attributes.forEach(function (item) {

                if ((item.search(/<html>/i) != -1) || (item.search(/<script>/i) != -1)) {
                    err.push('Don\'t even think to do smth like this.')
                }

                if (item.trim().length === 0) {
                    err.push('Some fields are empty.');
                }

                if (item.trim().length > 64) {
                    err.push('This field can\'t be such long.');
                }

                switch (item) {
                    case ($firstName):
                        if (/[^a-zA-Z\-]/.test($firstName)) {
                            err.push('First Name: Only valid characters: letters and -. \n');
                        }
                        break;
                    case ($lastName):
                        if (/[^a-zA-Z\-]/.test($lastName)) {
                            err.push('Last Name: Only valid characters: letters and -. \n');
                        }
                        break;
                    case ($email):
                        if (!$email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                            err.push('Email: Please input a valid email. \n');
                        }
                        break;
                        break;
                    case  ($phone):
                        if (!$phone.match(/^\+\d{12}$/)) {
                            err.push('Phone Number: Please input a valid phone number +xxxxxxxxxxxx. \n');
                        }
                        break;
                    case ($password):
                        if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/.test($password)) {
                            err.push('Password: Only valid characters: letters, numbers. \n');
                        }
                }
            });

            if (err.length == 0) {
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
            } else {
                err.forEach(function (item) {
                    alert(item);
                })
            }
        },

        onLogin: function (e) {
            var $thisEl;
            var $email;
            var $password;
            var $sms;
            var attributes;
            var err;

            e.stopPropagation();
            e.preventDefault();
            $thisEl = this.$el;
            $email = $thisEl.find('#logInMail').val();
            $password = $thisEl.find('#logInPass').val();
            $sms = $thisEl.find('#receivedCode').val();
            attributes = [];
            err = [];
            attributes.push($email, $password, $sms);
            attributes.forEach(function (item) {

                if ((item.search(/<html>/i) != -1) || (item.search(/<script>/i) != -1)) {
                    err.push('Don\'t even think to do smth like this')
                }

                if (item.trim().length === 0) {
                    err.push('This field can\'t be empty.');
                }

                if (item.trim().length > 64) {
                    err.push('This field can\'t be such long.');
                }

                switch (item) {
                    case ($email):
                        if (!$email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                            err.push('Please input a valid email.');
                        }
                        break;
                    case  ($sms):
                        if (!$sms.match(/\d{6}$/)) {
                            err.push('Please input a valid sms \'xxxxxx\'.');
                        }
                        break;
                    case ($password):
                        if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/.test($password)) {
                            err.push('Only valid characters: letters, numbers.');
                        }
                }
            });

            if (err.length == 0) {
                this.model = new User({
                    email   : $email,
                    password: $password,
                    sms     : $sms
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
            } else {
                err.forEach(function (item) {
                    alert(item);
                })
            }
        },

        onForgotPassPage: function(e){
            e.stopPropagation();
            e.preventDefault();

            Backbone.history.fragment='';
            Backbone.history.navigate('#myApp/forgotPass', {trigger: true});

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
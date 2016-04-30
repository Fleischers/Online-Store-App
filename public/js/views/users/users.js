define([
    'backbone',
    'underscore',
    'text!templates/user/oneUser.html',
    'models/user'
    /*'ENTER_KEY'*/
], function (Backbone, _, userTemplate, User) {
    var self;
    var url;
    var model;
    var $target;
    var $div;
    var $td;
    var $li;
    var value;
    var option;
    var changes;
    var trimmedValue;
    var id;
    var categoryUrl;
    var collection;
    var prodId;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(userTemplate),

        events: {
            'click #removeBtn'     : 'onRemove',
            'mouseover table#edit' : 'onHint',
            'mouseleave table#edit': 'onHideHint',
            'click table#edit'     : 'onEdit',
            'blur .edit'           : 'onCloseEdit',
            'keypress .edit'       : 'updateOnEnter',
            'click #logOutBtn'     : 'onLogOut'
        },

        initialize: function (opt) {
            var self = this;
            console.log('init');
            this.model = new User({_id: opt.id});
            this.model.fetch({
                success: function (user) {
                    var url = user.urlRoot + '/' + user.id;
                    self.render();
                },
                error  : function () {
                    alert('error');
                }
            });

            this.channel = opt.channel;
            this.render();
        },

        onRemove: function (e) {
            e.stopPropagation();
            var model = this.model;
            model.destroy({
                wait   : true,
                success: function (model) {
                    console.log('-- Removed ' + model.id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        onHint: function (e) {
            e.stopPropagation();

            var $target = $(e.target);
            var $div = $target.closest('div');
            $div.find('h4#main').hide();
            $div.find('h4#hint').show();
        },

        onHideHint: function (e) {
            e.stopPropagation();

            var $target = $(e.target);
            var $div = $target.closest('div');
            $div.find('h4#hint').hide();
            $div.find('h4#main').show();
        },

        onEdit: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $target = $(e.target);
            var $td = $target.closest('td');
            $td.find('span').hide();
            this.$input = $td.find('input').show();
            this.$input.focus();
        },

        onCloseEdit: function (e) {
            e.stopPropagation();

            var value = this.$input.val();
            var trimmedValue = value.trim();

            var $td = this.$input.closest('td');
            var option = $td.attr('id');

            var changes = {};
            changes[option] = trimmedValue;

            this.model.save(changes, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    var id = model.id;
                    var userUrl = '#myApp/users/account/' + id;
                    console.log('-- Updated id ' + id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp/users/account/' + id, {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        updateOnEnter: function (e) {
            /* if (e.which === ENTER_KEY) {
             this.close();
             }*/
        },

        onLogOut: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $thisEl = $(e.target);
            var id = $thisEl.attr('name');

            this.model = new User({
                _id: id
            });

            this.model.urlRoot = '/users/logout/';

            this.model.save(null, {
                wait    : true,
                validate: false,
                patch   : true,
                success : function (model) {
                    console.log('-- LoggedOut ---', model.attributes.success);
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp', {trigger: true});
                },
                error   : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {
            var idReceived;
            var model = this.model.toJSON();

            $.ajax({
                async: false,
                url    : 'isAuth',
                success: function (params) {

                },
                error  : function (error) {
                    Backbone.history.navigate('#myApp/users/create', {trigger: true});
                }
                }).done(function (data) {
                idReceived=data.success;
                return idReceived;
            });

            console.log(model._id);

            if(idReceived!=model._id){

                $.ajax({
                    url    : 'isAuthAdmin',
                    success: function (params) {
                        console.log('success');
                    },
                    error  : function (error) {
                        alert('Access denied');
                        Backbone.history.fragment='';
                        Backbone.history.navigate('#myApp', {trigger: true})
                    }
                });

            }

            if (model.baned == true) {
                alert('Write us to become unbanned and get access to account');
                Backbone.history.fragment = '';
                Backbone.history.navigate('#myApp', {trigger: true});
            }

            if (model.verified == false) {
                alert('Please verify your e-mail');
                Backbone.history.fragment = '';
                Backbone.history.navigate('#myApp', {trigger: true});
            }

            this.$el.html(this.template({model: model}));
        }

    });
});
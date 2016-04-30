define([
    'backbone',
    'underscore',
    'text!templates/navigation/adminNav.html',
    'models/user'
], function (Backbone, _, adminTemplate, User) {
    var baseUrl;
    var url;
    var id;

    return Backbone.View.extend({

        el: '#container-nav',

        template: _.template(adminTemplate),

        events: {
            'click #home'       : 'onHome',
            'click #orders'     : 'onOrders',
            'click #collections': 'onCollections',
            'click #products'   : 'onProducts',
            'click #customers'  : 'onCustomers',
            'click #logOut'     : 'onLogOut',
            'click #chat'       : 'onChat'
        },

        initialize: function (opt) {
            this.render();
        },

        onChat: function(e){
            baseUrl = '#myAdmin';
            url = baseUrl + '/logchat';

            e.stopPropagation();
            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});

        },

        onHome: function (e) {
            baseUrl = '#myAdmin';
            url = baseUrl + '/home';

            e.stopPropagation();
            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        onOrders: function (e) {
            baseUrl = '#myAdmin';
            url = baseUrl + '/plainOrders/q=All/p=1';

            e.stopPropagation();
            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        onCollections: function (e) {
            baseUrl = '#myAdmin';
            url = baseUrl + '/categories';

            e.stopPropagation();
            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        onProducts: function (e) {
            baseUrl = '#myAdmin';
            url = baseUrl + '/products';

            e.stopPropagation();
            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        onCustomers: function (e) {
            baseUrl = '#myAdmin';
            url = baseUrl + '/users';

            e.stopPropagation();
            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        onLogOut: function (e) {
            e.stopPropagation();
            e.preventDefault();

            $.ajax({
                url    : 'isAuth',
                success: function (params) {
                    id = params.success;

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
                            Backbone.history.navigate('#myAdmin', {trigger: true});
                        }
                    });
                },
                error  : function (error) {
                    Backbone.history.navigate('#myAdmin', {trigger: true});
                }
            });
        },

        render: function () {

            this.$el.html(this.template());
        }
    });
});
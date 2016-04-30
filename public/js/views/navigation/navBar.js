define([
    'backbone',
    'underscore',
    'text!templates/navigation/storeNav.html',
    'views/navigation/footer',
    'collections/categories'
], function (Backbone, _, navTemplate, Subview, Categories) {
    var $searchFor;

    return Backbone.View.extend({

        el: '#container-nav',

        events: {
            'click a#user'        : 'onUserPage',
            'click a#home'        : 'onHome',
            'click a#gohome'      : 'onHome',
            'click a#chat'        : 'onChat',
            'click a#cart'        : 'onCart',
            'click a#products'    : 'onProducts',
            'click a#categories'    : 'onCategories',
            'click li#search'     : 'onSearch',
            'click a#categoryName': 'onCategory'
        },

        template: _.template(navTemplate),

        subview: new Subview(),

        initialize: function (opt) {
            var collection;
            var self = this;
            this.channel = opt.channel;

            this.collection = new Categories();
            collection = this.collection;
            collection.fetch({
                success: function (models) {
                    url = models.urlRoot + '/' + models.id;
                    self.render();
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });

            this.render();
        },

        onCategory: function (e) {
            var $target;
            var categoryQuery;

            e.stopPropagation();
            $target = $(e.target);
            categoryQuery = $target.attr('data-id');
            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/products/q=' + categoryQuery + '/p=1', {trigger: true});
        },

        onProducts: function (e) {
            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/products/p=1', {trigger: true});
        },

        onCategories: function(e){
            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/categories/p=1', {trigger: true});
        },

        onCart: function (e) {
            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/cart', {trigger: true});
        },

        onChat: function (e) {
            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/chat', {trigger: true});
        },

        onSearch: function (e) {
            $searchFor = $('input#searchFor').val();
            if ($searchFor == 0) {
                alert('Type something!');
            } else {
                Backbone.history.fragment = '';
                Backbone.history.navigate('#myApp/products/q=' + $searchFor + '/p=1', {trigger: true});
            }
        },

        onUserPage: function () {

            Backbone.history.navigate('#myApp/users/create', {trigger: true});
        },

        onHome: function () {

            Backbone.history.navigate('#myApp', {trigger: true});

        },

        render: function () {
            var collection;
            collection = this.collection.toJSON();
            // this.subview.render();
            // this.subview.delegateEvents();
            this.$el.html(this.template({collection: collection}));
        }
    });
});

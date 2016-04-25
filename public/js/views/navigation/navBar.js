define([
    'backbone',
    'underscore',
    'text!templates/navigation/storeNav.html',
    'views/navigation/footer'
], function (Backbone, _, navTemplate, Subview) {
    var $searchFor;

    return Backbone.View.extend({

        el: '#container-nav',

        events: {
            'click a#user'   : 'onUserPage',
            'click a#home'   : 'onHome',
            'click a#gohome' : 'onHome',
            'click a#chat'   : 'onChat',
            'click li#search': 'onSearch'
        },

        template: _.template(navTemplate),

        subview: new Subview(),

        initialize: function (opt) {
            this.channel = opt.channel;
            this.render();
        },

        onChat:function(e){
            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/chat', {trigger: true});
        },

        onSearch: function (e) {
            $searchFor = $('input#searchFor').val();
            if ($searchFor == 0) {
                alert('Type something!');
            } else {
                Backbone.history.fragment = '';
                Backbone.history.navigate('#myApp/products/q=' + $searchFor, {trigger: true});
            }
        },

        onUserPage: function () {

            Backbone.history.navigate('#myApp/users/create', {trigger: true});
        },

        onHome: function () {

            Backbone.history.navigate('#myApp', {trigger: true});

        },

        render: function () {

            // this.subview.render();
            // this.subview.delegateEvents();
            this.$el.html(this.template());
        }
    });
});

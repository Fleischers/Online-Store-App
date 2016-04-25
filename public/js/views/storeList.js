define([
    'backbone'
], function (Backbone) {
    var $target;
    var $div;
    var prodId;
    var collection;

    return Backbone.View.extend({
        el: '#container',

        events    : {
            'click #product': 'onProduct'
        },
        initialize: function (opt) {
            this.channel = opt.channel;
            this.render();
        },
        onProduct : function (e) {
            e.stopPropagation();

            $target = $(e.target);
            $div = $target.closest('div.thumbnail');
            prodId = $div.attr('id');

            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/products/' + prodId, {trigger: true});

        },

        render: function () {
            collection=this.collection.toJSON();

            this.$el.html(this.template({collection: collection}));
        }
    });
});
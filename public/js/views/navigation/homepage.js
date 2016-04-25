define([
    'backbone',
    'underscore',
    'text!templates/navigation/homepage.html'
], function (Backbone, _, contentTemplate){
    return Backbone.View.extend({

        el: '#container',

        template: _.template(contentTemplate),

        initialize: function (opt) {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
        }
    });
});

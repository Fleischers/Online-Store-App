define([
    'backbone',
    'underscore',
    'text!templates/navigation/storeFooter.html'
], function (Backbone, _, footTemplate) {
    return Backbone.View.extend({

        el: '#container-foot',

        template: _.template(footTemplate),

        initialize: function (opt) {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
        }
    });
});
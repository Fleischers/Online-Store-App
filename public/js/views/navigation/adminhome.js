define([
    'backbone',
    'underscore',
    'text!templates/navigation/adminhome.html'
], function (Backbone, _, homeTemplate) {
    return Backbone.View.extend({

        el: '#container',

        template: _.template(homeTemplate),

        initialize: function (opt) {
            this.render();
        },

        render: function () {
            $.ajax({
                url    : 'isAuthAdmin',
                success: function (params) {
                    //console.log(params.success);
                },
                error  : function (error) {
                    Backbone.history.navigate('#myAdmin', {trigger: true});
                }
            });

            this.$el.html(this.template());
        }
    });
});

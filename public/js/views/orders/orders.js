define([
    'backbone',
    'underscore',
    'text!templates/order/order.html',
    'models/order'
    /*'ENTER_KEY'*/
], function (Backbone, _, orderTemplate, Order) {
    var self;
    var url;
    var model;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(orderTemplate),

        events: {
            'click #placeOrder': 'onFulfill'
        },

        initialize: function (opt) {
            self = this;

            this.model = new Order({_id: opt.id});
            this.model.fetch({
                success: function (category) {
                    url = category.urlRoot + '/' + category.id;
                    self.render();
                },
                error  : function () {
                    alert('error');
                }
            });
            this.render();
        },

        onFulfill: function (e) {
            e.stopPropagation();
            model = this.model;
            model.save({status: 'Fulfilled'}, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    alert('Order is fulfilled! Thank you!');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/orders', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {
            model = this.model.toJSON();
            this.$el.html(this.template({model: model}));
        }

    });
});

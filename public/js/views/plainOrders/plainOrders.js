define([
    'backbone',
    'underscore',
    'text!templates/order/order.html',
    'models/plainOrder'
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
                success: function (order) {
                    url = order.urlRoot + '/' + order.id;
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
                    Backbone.history.navigate('#myAdmin/plainOrders', {trigger: true});
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

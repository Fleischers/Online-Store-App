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
            'click #fulfillOrder': 'onFulfill',
            'click #sendEmail'   : 'onSendEmail'
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

        onSendEmail: function(e){
            e.stopPropagation();
            model = this.model;
            model.save({status: 'Recovery'}, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    alert('Recovery email was sent');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/plainOrders/q=All/p=1', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
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
                    Backbone.history.navigate('#myAdmin/plainOrders/q=All/p=1', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {
            var $thisEl;
            var $activeButton;

            model = this.model.toJSON();
            this.$el.html(this.template({model: model}));

            if (model.status == 'Placed') {
                $thisEl = this.$el;
                $activeButton = $thisEl.find('div#fulfillOrder');
                $activeButton.show();
            } else if (model.status == 'Abandoned') {
                $thisEl = this.$el;
                if(model.emailSent){
                    $activeButton = $thisEl.find('div#emailSent');
                    $activeButton.show();
                }else{
                    $activeButton = $thisEl.find('div#sendEmail');
                    $activeButton.show();
                }
            }
        }
    });
});

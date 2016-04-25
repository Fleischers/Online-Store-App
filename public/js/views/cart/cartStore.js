define([
    'backbone',
    'underscore',
    'text!templates/order/create.html',
    'models/order'
    /*'ENTER_KEY'*/
], function (Backbone, _, cartTemplate, Order) {
    var model;
    var self;
    var $thisEl;
    var $comment;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(cartTemplate),

        events: {
            'click #cancelOrder': 'onCancelOrder',
            'click #placeOrder' : 'onPlaceOrder'
        },

        initialize: function (opt) {
            self = this;
            this.model = new Order({_id: opt.id});
            this.model.fetch({
                success: function (order) {
                    console.log(order);
                    var url = order.urlRoot + '/' + order.id;
                    self.render();
                },
                error  : function () {
                    alert('error');
                }
            });
        },

        onCancelOrder: function (e) {
            e.stopPropagation();
            $.jStorage.flush('productId');
            $.jStorage.flush('prices');
            $.jStorage.flush('quantity');

            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp', {trigger: true});
        },

        onPlaceOrder: function (e) {
            $thisEl = this.$el;
            $comment = $thisEl.find('#comment').val();

            model = this.model;
            model.save({
                comment: $comment,
                status : 'Placed'
            }, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    alert('Your order was successfully saved! Thank you!');
                    $.jStorage.flush('productId');
                    $.jStorage.flush('prices');
                    $.jStorage.flush('quantity');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {
            $.ajax({
                url    : 'isAuth',
                success: function () {
                },
                error  : function (error) {
                    alert('Log in to place an order');
                    Backbone.history.navigate('#myApp/users/create', {trigger: true});
                }
            });


            model = this.model.toJSON();
            this.$el.html(this.template({model: model}));
        }
    });
});
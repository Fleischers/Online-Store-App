define([
    'backbone',
    'underscore',
    'text!templates/product/productForStore.html',
    'models/product',
    'models/productReview'
    /*'ENTER_KEY'*/
], function (Backbone, _, productTemplate, Product, Review) {
    var model;
    var self;
    var $target;
    var $thisEl;
    var description;
    var postedBy;
    var product;
    var id;
    var price;
    var quantity;
    var prodArr;
    var priceArr;
    var quantityArr;
    var userId;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(productTemplate),

        events: {
            'click #sendReview': 'onSendReview',
            'click #addToCart' : 'onAddToCart',
            'click #toCart'    : 'onCart'
        },

        initialize: function (opt) {
            self = this;

            this.model = new Product({_id: opt.id});
            this.model.fetch({
                success: function (product) {
                    var url = product.urlRoot + '/' + product.id;
                    self.render();
                },
                error  : function () {
                    alert('error');
                }
            });
            this.render();
        },

        onSendReview: function (e) {
            $target = $(e.target);
            $thisEl = this.$el;
            description = $thisEl.find('#description').val();
            product = $target.attr('data-id');

            $.ajax({
                url    : 'isAuth',
                success: function (params) {
                    postedBy = params.success;

                    this.model = new Review({
                        postedBy   : postedBy,
                        description: description,
                        product    : product
                    });

                    this.model.urlRoot = '/productReviews';

                    this.model.save(null, {
                        wait   : true,
                        success: function (model) {

                            Backbone.history.fragment = '';
                            Backbone.history.navigate('#myApp/products/' + product, {trigger: true})
                        },
                        error  : function (model, xhr) {
                            alert(xhr.statusText);
                        }
                    });
                },
                error  : function (error) {
                    alert('LogIn to add a review')
                }
            });
        },

        onAddToCart: function (e) {
            $target = $(e.target);
            id = $target.attr('data-id');
            price = $('h3#price').attr('data-id');
            quantity = $('select#quantity option:selected').val();

            $.ajax({
                url    : 'isAuth',
                success: function (params) {
                    userId = $.jStorage.set('userId', params.success);
                    prodArr = $.jStorage.get('productId') || [];
                    prodArr.push(id);
                    priceArr = $.jStorage.get('prices') || [];
                    priceArr.push(price);
                    quantityArr = $.jStorage.get('quantity') || [];
                    quantityArr.push(quantity);
                    $.jStorage.set('productId', prodArr);
                    $.jStorage.set('prices', priceArr);
                    $.jStorage.set('quantity', quantityArr);
                },
                error  : function (error) {
                    alert('LogIn to add a review')
                }
            });
        },

        onCart: function (e) {
            e.stopPropagation();

            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/cart', {trigger: true})
        },

        render: function () {
            model = this.model.toJSON();

            this.$el.html(this.template({model: model}));
        }

    });
});

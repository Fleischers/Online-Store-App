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
            'click #toCart'    : 'onCart',
            'click li#page'    : 'onPage'
        },

        initialize: function (opt) {
            var number;
            var page;
            var count;
            this.page = 1;

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
            var basicUrl;
            var err;

            err = [];
            $target = $(e.target);
            $thisEl = this.$el;
            description = $thisEl.find('#description').val();
            product = $target.attr('data-id');

            if ((description.search(/<html>/i) != -1) || (description.search(/<script>/i) != -1)) {
                err.push('Don\'t even think to do smth like this')
            }

            if (description.trim().length === 0) {
                err.push('This field can\'t be empty.');
            }

            if (description.trim().length > 255) {
                err.push('This field can\'t be such long.');
            }

            if (err.length == 0) {
                $.ajax({
                    async  : false,
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
                                alert('Review added');
                                basicUrl = Backbone.history.fragment;
                                Backbone.history.fragment = '';
                                Backbone.history.navigate(basicUrl, {trigger: true})
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
            } else {
                err.forEach(function (item) {
                    alert(item);
                })
            }
        },

        onAddToCart: function (e) {
            $target = $(e.target);
            id = $target.attr('data-id');
            //price = $('h3#price').attr('data-id');
            quantity = $('select#quantity option:selected').val();

            $.ajax({
                url    : 'isAuth',
                success: function (params) {
                    prodArr = $.jStorage.get('productId') || [];
                    prodArr.push(id);
                    quantityArr = $.jStorage.get('quantity') || [];
                    quantityArr.push(quantity);
                    $.jStorage.set('userId', params.success);
                    $.jStorage.set('productId', prodArr);
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

        onPage: function (e) {
            var self = this;
            var $target;
            var $page;
            var contentType;

            e.stopPropagation();
            $target = $(e.target);
            $page = $target.html();
            this.page = $page;
            this.render();
        },

        render: function () {
            var count;
            var $thisEl;
            var subPages;
            var page;
            var $li;
            var pagesArr = [];
            page = this.page;
            model = this.model.toJSON();
            count = 5;
            if (model.productReviews) {
                subPages = Math.ceil(model.productReviews.length / count);
                for (var i = 0; i < subPages; i++) {
                    pagesArr.push(i + 1);
                }
                model.productReviews = (model.productReviews).slice((page - 1) * count, page * (count));
            }

            this.$el.html(this.template({
                model: model,
                pages: pagesArr
            }));

            $thisEl = this.$el;

            $li = $thisEl.find("[data-id='" + this.page + "']");
            $li.addClass('active');
        }
    });
});

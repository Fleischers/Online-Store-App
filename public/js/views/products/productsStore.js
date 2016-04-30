define([
    'backbone',
    'underscore',
    'text!templates/product/productForStore.html',
    'models/product',
    'models/productReview',
    'collections/productReviews',
    'collections/productReviewsCount'
    /*'ENTER_KEY'*/
], function (Backbone, _, productTemplate, Product, Review, ProductReviews, Count) {
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
            console.log(opt);
            var number;
            var page;
            var count;
            this.page = opt.page;

            self = this;
            page = this.page || 1;
            count = count || 5;

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

            this.collection = new ProductReviews();
            this.collection.fetch({
                reset: true,
                data : {
                    page  : page,
                    count : count,
                    filter: opt.id
                }
            });

            this.additionalCollection = new Count();
            this.additionalCollection.fetch({
                async: false,
                reset: true,
                data : {
                    filter: opt.id
                }
            }).done(function (result) {
                number = result.success;
                return number;
            });

            this.pages = Math.ceil(number / count);

            this.render();
        },

        onSendReview: function (e) {
            var url;
            var basicUrl;
            var page;
            page=this.pages;
            console.log(page);
            $target = $(e.target);
            $thisEl = this.$el;
            description = $thisEl.find('#description').val();
            product = $target.attr('data-id');

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
                            url = basicUrl.substring(0, basicUrl.length - 1);
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(url+page, {trigger: true})
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

        onPage: function (e) {
            var $target;
            var $page;
            var url;
            var basicUrl;
            e.stopPropagation();

            $target = $(e.target);
            $page = $target.html();
            basicUrl = Backbone.history.fragment;
            url = basicUrl.substring(0, basicUrl.length - 1);
            Backbone.history.navigate('#' + url + $page, {trigger: true});
        },

        render: function () {
            var collection;
            var $thisEl;
            var $li;
            var pages = this.pages;
            model = this.model.toJSON();
            collection = this.collection.toJSON();
            console.log(pages);

            var pagesArr = [];

            for (var i = 0; i < pages; i++) {
                pagesArr.push(i + 1);
            }

            this.$el.html(this.template({
                model     : model,
                collection: collection,
                pages     : pagesArr
            }));

            $thisEl = this.$el;

            $li = $thisEl.find("[data-id='" + this.page + "']");
            $li.addClass('active');
        }
    });
});

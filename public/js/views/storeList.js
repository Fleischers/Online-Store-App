define([
    'backbone',
    'collections/categories'
], function (Backbone, Categories) {
    var $target;
    var $div;
    var prodId;
    var collection;

    return Backbone.View.extend({
        el: '#container',

        events    : {
            'click #product': 'onProduct',
            'click a#categoryName': 'onCategory',
            'click div#category': 'onCategory',
            'click li#page': 'onPage',
            'click li.sort': 'onSort'
        },
        initialize: function (opt) {

            var additionalCollection;
            var self = this;

            this.page = opt.page;
            this.num = opt.num;
            this.pageCount = opt.pageCount;

            this.additionalCollection = new Categories();
            additionalCollection = this.additionalCollection;
            additionalCollection.fetch({
                success: function (models) {
                    url = models.urlRoot + '/' + models.id;
                    self.render();
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });

            this.channel = opt.channel;
            this.render();
        },

        onCategory: function (e) {
            var $target;
            var categoryQuery;

            e.stopPropagation();
            $target = $(e.target);
            categoryQuery = $target.attr('data-id');
            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/products/q=' + categoryQuery + '/p=1', {trigger: true});
        },

        onProduct: function (e) {
            e.stopPropagation();

            $target = $(e.target);
            $div = $target.closest('div.thumbnail');
            prodId = $div.attr('id');

            Backbone.history.fragment = '';
            Backbone.history.navigate('#myApp/products/' + prodId + '/p=1', {trigger: true});

        },

        onPage: function (e) {
            var $target;
            var $page;
            var contentType;
            var url;
            var basicUrl;
            e.stopPropagation();
            contentType = this.contentType.split(' ');
            contentType = contentType[0];

            $target = $(e.target);
            $page = $target.html();
            basicUrl = Backbone.history.fragment;
            url = basicUrl.substring(0, basicUrl.length - 1);
            Backbone.history.navigate('#' + url + $page, {trigger: true});

        },

        onSort: function (e) {
            var $target;
            var baseUrl;
            var url;
            var sortBy;
            var index;
            $target = $(e.target);
            sortBy = $target.attr('data-id');
            baseUrl = Backbone.history.fragment;
            index = baseUrl.indexOf('s=');
            if ((index + 1) == 0) {
                url = baseUrl.substring(0, baseUrl.length - 3);
            } else {
                url = baseUrl.substring(0, index);
            }

            Backbone.history.fragment = '';
            Backbone.history.navigate('#' + url + 's=' + sortBy + '/p=1', {trigger: true});
        },

        render: function () {
            collection = this.collection.toJSON();
            var pages = this.pageCount;
            var pagesArr = [];
            var $thisEl;
            var $li;

            for (var i = 0; i < pages; i++) {
                pagesArr.push(i + 1);
            }
            var additionalCollection = this.additionalCollection.toJSON();

            this.$el.html(this.template({
                collection          : collection,
                additionalCollection: additionalCollection,
                pages               : pagesArr
            }));
            $thisEl = this.$el;

            $li = $thisEl.find("[data-id='" + this.page + "']");
            $li.addClass('active');
        }
    });
});
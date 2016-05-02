define([
    'backbone',
    'underscore',
    'text!templates/category/category.html',
    'models/category'
    /*'ENTER_KEY'*/
], function (Backbone, _, categoryTemplate, Category, Products) {
    var self;
    var url;
    var model;
    var $target;
    var $div;
    var $td;
    var $li;
    var value;
    var option;
    var changes;
    var trimmedValue;
    var id;
    var categoryUrl;
    var collection;
    var prodId;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(categoryTemplate),

        events: {
            'click #addProduct'    : 'onAddProduct',
            'click #removeBtn'     : 'onRemove',
            'mouseover table#edit' : 'onHint',
            'mouseleave table#edit': 'onHideHint',
            'click table#edit'     : 'onEdit',
            'blur .edit'           : 'onCloseEdit',
            'click li#page'        : 'onPage',
            'keypress .edit'       : 'updateOnEnter'
        },

        contentType: 'products',

        initialize: function (opt) {
            self = this;
            this.page = 1;
            this.model = new Category({_id: opt.id});
            model = this.model;
            model.fetch({
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

        onRemove: function (e) {
            e.stopPropagation();

            model = this.model;
            model.destroy({
                wait   : true,
                success: function (model) {
                    console.log('-- Removed ' + model.id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/categories', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        onHint: function (e) {
            e.stopPropagation();

            $target = $(e.target);
            $div = $target.closest('div');
            $div.find('h4#main').hide();
            $div.find('h4#hint').show();
        },

        onHideHint: function (e) {
            e.stopPropagation();

            $target = $(e.target);
            $div = $target.closest('div');
            $div.find('h4#hint').hide();
            $div.find('h4#main').show();
        },

        onEdit: function (e) {
            e.stopPropagation();
            e.preventDefault();

            $target = $(e.target);
            $td = $target.closest('td');
            $td.find('span').hide();
            this.$input = $td.find('input').show();
            this.$input.focus();
        },

        onCloseEdit: function (e) {
            e.stopPropagation();

            value = this.$input.val();
            trimmedValue = value.trim();

            $td = this.$input.closest('td');
            option = $td.attr('id');

            changes = {};
            changes[option] = trimmedValue;

            model = this.model;
            model.save(changes, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    id = model.id;
                    categoryUrl = '#myAdmin/categories/' + id;
                    console.log('-- Updated id ' + id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(categoryUrl, {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        updateOnEnter: function (e) {
            /* if (e.which === ENTER_KEY) {
             this.close();
             }*/
        },

        onPage: function (e) {
            var self=this;
            var $target;
            var $page;
            var contentType;

            e.stopPropagation();
            $target = $(e.target);
            $page = $target.html();
            this.page=$page;
            this.render();
        },

        render: function () {
            var count;
            var $thisEl;
            var subPages;
            var page;
            var pagesArr = [];
            page = this.page;
            model = this.model.toJSON();
            count = 2;
            if (model.products) {
                subPages = Math.ceil(model.products.length / count);
                for (var i = 0; i < subPages; i++) {
                    pagesArr.push(i + 1);
                }
                model.products = (model.products).slice((page - 1) * count, page * (count));
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
           
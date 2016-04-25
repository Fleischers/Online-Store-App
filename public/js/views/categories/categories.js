define([
    'backbone',
    'underscore',
    'text!templates/category/category.html',
    'models/category',
    'collections/products'
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
            'keypress .edit'       : 'updateOnEnter'
        },

        contentType: 'products',

        initialize: function (opt) {
            self = this;

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

            this.collection = new Products();
            collection = this.collection;
            collection.fetch({
                success: function (models) {
                    url = models.urlRoot + '/' + models.id;
                    self.render();
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });

            this.render();
        },

        onAddProduct: function (e) {
            self = this;

            e.stopPropagation();

            $target = $(e.target);
            $li = $target.closest('li');
            prodId = $li.attr('id');

            changes = {};
            changes['products'] = prodId;

            model = this.model;
            model.save(changes, {
                patch  : true,
                wait   : true,
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/categories/' + self.model.id, {trigger: true})
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
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

        render: function () {
            model = this.model.toJSON();
            collection = this.collection.toJSON();

            this.$el.html(this.template({
                collection: collection,
                model     : model
            }));
        }

    });
});

define([
    'backbone',
    'underscore',
    'models/category',
    'text!templates/category/create.html'
], function (Backbone, _, Category, create) {
    var name;
    var description;
    var $thisEl;
    var model;

    return Backbone.View.extend({
        el      : '#container',
        template: _.template(create),
        events  : {
            'click #createBtn'   : 'onSave'
        },

        initialize: function (opt) {
            this.render();
        },

        onSave: function (e) {
            e.stopPropagation();
            e.preventDefault();

            $thisEl = this.$el;
            name = $thisEl.find('#name').val();
            description = $thisEl.find('#description').val();

            this.model = new Category({
                name: name,
                description : description
            });
            model=this.model;

            model.urlRoot = '/categories';

            model.save(null, {
                wait   : true,
                success: function (model) {
                    var id = model.id;
                    //var productUrl = '#myApp/users/account/' + id;
                    console.log('-- Created with id ' + id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/categories/s=name:1/p=1', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {

            this.$el.html(this.template());
        }

    });
});

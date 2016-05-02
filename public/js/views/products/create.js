define([
    'backbone',
    'underscore',
    'models/product',
    'text!templates/product/create.html'
], function (Backbone, _, Product, create) {
    var $thisEl;
    var name;
    var price;
    var status;
    var manufacturer;
    var description;

    return Backbone.View.extend({
        el      : '#container',
        template: _.template(create),
        events  : {
            'click #createBtn': 'onSave'
        },

        initialize: function (opt) {
            this.render();
        },

        onSave: function (e) {
            e.stopPropagation();
            e.preventDefault();

            $thisEl = this.$el;
            name = $thisEl.find('#name').val();
            price = $thisEl.find('#price').val();
            status = $thisEl.find('#status').is(":checked");
            manufacturer = $thisEl.find('#manufacturer').val();
            description = $thisEl.find('#description').val();

            this.model = new Product({
                name         : name,
                price        : price,
                statusEnabled: status,
                manufacturer : manufacturer,
                description  : description
            });

            this.model.urlRoot = '/products';

            this.model.save(null, {
                wait   : true,
                success: function (model) {
                    var id = model.id;
                    //var productUrl = '#myApp/users/account/' + id;
                    console.log('-- Created with id ' + id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/products', {trigger: true});
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

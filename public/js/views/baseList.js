define([
    'backbone'
], function (Backbone) {
    var collection;
    var $checkboxes;
    var $target;
    var id;
    var model;
    var navigateUrl;
    var $tr;

    return Backbone.View.extend({
        el: '#container',

        events: {
            'click #banBtn'    : 'onBan',
            'click #unbanBtn'  : 'onUnban',
            'click #createBtn1': 'onCreate',
            'click #firstName' : 'onAccount',
            'click #name'      : 'onAccount',
            'click #removeBtn' : 'onRemove',
            'click #product'   : 'onProduct'
        },

        initialize: function (opt) {
            this.channel = opt.channel;
            this.render();
        },

        onBan: function (e) {
            e.stopPropagation();

            collection = this.collection;
            $checkboxes = $("input:checkbox:checked");

            $checkboxes.each(function () {
                $target = $(this);
                id = $target.attr('data-id');
                model = collection.get(id);
                if (!model) {
                    return false;
                }
                model.save({baned: true}, {
                    patch  : true,
                    wait   : true,
                    success: function (model) {
                        alert('User banned');
                        Backbone.history.fragment = '';
                        Backbone.history.navigate('#myAdmin/users', {trigger: true})
                    },
                    error  : function (model, xhr) {
                        alert(xhr.statusText);
                    }
                });
            });
        },

        onUnban: function (e) {
            e.stopPropagation();

            collection = this.collection;
            $checkboxes = $("input:checkbox:checked");

            $checkboxes.each(function () {
                $target = $(this);
                id = $target.attr('data-id');
                model = collection.get(id);
                if (!model) {
                    return false;
                }
                model.save({baned: false}, {
                    patch  : true,
                    wait   : true,
                    success: function (model) {
                        alert('User UnBanned');
                        Backbone.history.fragment = '';
                        Backbone.history.navigate('#myAdmin/users', {trigger: true})
                    },
                    error  : function (model, xhr) {
                        alert(xhr.statusText);
                    }
                });
            });
        },

        onCreate: function (e) {
            e.stopPropagation();
            e.preventDefault();

            navigateUrl = '#myAdmin/' + this.contentType + '/create';

            Backbone.history.fragment = '';
            Backbone.history.navigate(navigateUrl, {trigger: true});
        },

        onAccount: function (e) {
            e.stopPropagation();
            e.preventDefault();

            $target = $(e.target);
            $tr = $target.closest('tr');
            id = $tr.attr('id');

            if (this.contentType == 'users') {
                Backbone.history.fragment = '';
                Backbone.history.navigate('#myApp/users/account/' + id, {trigger: true});
            } else {
                Backbone.history.fragment = '';
                Backbone.history.navigate('#myAdmin/' + this.contentType + '/' + id, {trigger: true});
            }

        },

        onRemove: function (e) {
            e.stopPropagation();

            collection = this.collection;
            $checkboxes = $("input:checkbox:checked");
            navigateUrl = '#myAdmin/' + this.contentType;

            $checkboxes.each(function () {
                $target = $(this);
                id = $target.attr('data-id');
                model = collection.get(id);

                if (!model) {
                    return false;
                }

                model.destroy({
                    wait   : true,
                    success: function (model) {
                        console.log('-- Removed ' + model.id + ' ----');
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(navigateUrl, {trigger: true});
                    },
                    error  : function (model, xhr) {
                        alert(xhr.statusText);
                    }
                });
            });
        },

        render: function () {

            $.ajax({
                url    : 'isAuthAdmin',
                success: function (params) {
                    console.log('success');
                },
                error  : function (error) {
                    Backbone.history.navigate('#myAdmin', {trigger: true});
                }
            });
            console.log(this.collection.toJSON());
            this.$el.html(this.template({collection: this.collection.toJSON()}));
        }
    });
});

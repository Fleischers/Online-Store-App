define([
    'backbone',
    'underscore',
    'text!templates/product/product.html',
    'models/product',
    'collections/categories',
    'cropper'
    /*'ENTER_KEY'*/
], function (Backbone, _, productTemplate, Product, Category, cropper) {
    var self;
    var img;
    var canvas;
    var context;
    var _URL;
    var sourceX;
    var sourceY;
    var sourceWidth;
    var sourceHeight;
    var destWidth;
    var destHeight;
    var destX;
    var destY;
    var idReceived;
    var id;
    var dataURL;
    var blobBin;
    var array;
    var file;
    var formdata;
    var model;
    var $target;
    var $div;
    var $td;
    var value;
    var option;
    var changes;
    var trimmedValue;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(productTemplate),

        events: {
            'click #removeBtn'     : 'onRemove',
            'mouseover table#edit' : 'onHint',
            'mouseleave table#edit': 'onHideHint',
            'click table#edit'     : 'onEdit',
            'blur .edit'           : 'onCloseEdit',
            'keypress .edit'       : 'updateOnEnter',
            'click #logOutBtn'     : 'onLogOut',
            'click #uploadImg'     : 'sendPicture',
            'click #addCategory'   : 'onAddCategory',
            'click #removeCategory': 'onRemoveCategory'
        },

        initialize: function (opt) {
            var collection;
            self = this;

            this.$el.on('change', '#imageInput', this.pictureAdded);

            this.model = new Product({_id: opt.id});
            this.model.fetch({
                success: function (product) {

                    //var url = product.urlRoot + '/' + product.id;
                    self.render();
                },
                error  : function () {
                    alert('error');
                }
            });

            this.collection = new Category();
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

        pictureAdded: function (e) {
            var $canvasImage;
            canvas = document.getElementById('myCanvas');
            context = canvas.getContext('2d');
            _URL = window.URL || window.webkitURL;

            if (e.target.files && e.target.files[0]) {
                img = new Image();
                img.src = _URL.createObjectURL(e.target.files[0]);
                $canvasImage=$('#canvasImage');
                $canvasImage.attr('src', img.src);
            }

            $canvasImage.cropper({
                aspectRatio: 9 / 9,
                crop       : function (e) {
                    // Output the result data for cropping image.
                    sourceX = e.x;
                    sourceY = e.y;
                    sourceWidth = e.width;
                    sourceHeight = e.height;
                    context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 500, 500);
                }
            });

        },

        sendPicture: function (e) {
            e.stopPropagation();
            self = this;
            id = $(e.target).attr('data-id');

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                canvas = document.getElementById("myCanvas");
                dataURL = canvas.toDataURL();
                document.getElementById('canvasImg').src = dataURL;
                context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                $('#canvasImage').cropper('destroy');

                blobBin = atob(dataURL.split(',')[1]);
                array = [];

                for (var i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                }

                file = new Blob([new Uint8Array(array)], {type: 'image/png'});
                formdata = new FormData();
                formdata.append("myNewFileName", file);

                $.ajax({
                    url        : 'products/' + id,
                    type       : "POST",
                    data       : formdata,
                    processData: false,
                    contentType: false,
                    success    : function (res) {
                        //console.log(res.success);
                    },
                    error      : function (xhr, status, error) {
                        console.log(xhr, status, error);
                    }
                }).done(function (res) {
                    alert('image saved!');

                    idReceived = res.success;
                    $('img#canvasImg').removeAttr('src');
                    $('img#canvasImage').removeAttr('src');
                    $('img#image').attr("src", idReceived + '?' + Math.random());
                });
            }
        },

        onRemove: function (e) {
            e.stopPropagation();

            model = this.model;
            model.destroy({
                wait   : true,
                success: function (model) {
                    console.log('-- Removed ' + model.id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/products', {trigger: true});
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

            this.model.save(changes, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    var id = model.id;
                    var productUrl = '#myAdmin/products/' + id;
                    console.log('-- Updated id ' + id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(productUrl, {trigger: true});
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

        onAddCategory: function (e) {
            var categoryId;
            var $li;
            self = this;

            e.stopPropagation();

            $target = $(e.target);
            $li = $target.closest('li');
            categoryId = $li.attr('id');

            changes = {};
            changes['categories'] = categoryId;

            model = this.model;
            model.save(changes, {
                patch  : true,
                wait   : true,
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/products/' + self.model.id, {trigger: true})
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        onRemoveCategory: function (e) {
            var $target;
            var categoryId;
            var model;
            e.stopPropagation();
            $target = $(e.target);
            categoryId = $target.attr('data-id');
            console.log(categoryId);
            changes = {};
            changes['categories'] = categoryId;
            model = this.model;
            model.urlRoot = '/products/removeCategory/';
            model.save(changes, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    var id = model.id;
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/products/' + id, {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {
            var collection;
            var $thisEl;
            var $li;
            collection = this.collection.toJSON();
            model = this.model.toJSON();

            this.$el.html(this.template({
                collection: collection,
                model     : model
            }));

            $thisEl = this.$el;
            if (model.categories) {
                model.categories.forEach(function (item) {
                    $li = $thisEl.find('li#' + item._id);
                    $li.hide()
                })
            }
        }

    });
});

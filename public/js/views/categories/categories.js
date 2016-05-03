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
            'click #uploadImg'     : 'sendPicture',
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

            this.$el.on('change', '#imageInput', this.pictureAdded);

            this.render();
        },
        pictureAdded: function (e) {
            var $canvasImage;
            var canvas;
            var context;
            var _URL;
            var img;
            var sourceX;
            var sourceY;
            var sourceWidth;
            var sourceHeight;
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
                aspectRatio: 4 / 2,
                crop       : function (e) {
                    // Output the result data for cropping image.
                    sourceX = e.x;
                    sourceY = e.y;
                    sourceWidth = e.width;
                    sourceHeight = e.height;
                    context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
                }
            });

        },

        sendPicture: function (e) {
            var canvas;
            var context;
            var dataURL;
            var blobBin;
            var array;
            var formdata;
            var file;
            var idReceived;
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
                    url        : 'categories/' + id,
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
           
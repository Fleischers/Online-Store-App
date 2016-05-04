define([
    'backbone',
    'underscore',
    'text!templates/user/oneUser.html',
    'models/user'
    /*'ENTER_KEY'*/
], function (Backbone, _, userTemplate, User) {
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

        template: _.template(userTemplate),

        events: {
            'click #uploadImg'     : 'sendPicture',
            'click #removeBtn'     : 'onRemove',
            'mouseover table#edit' : 'onHint',
            'mouseleave table#edit': 'onHideHint',
            'click table#edit'     : 'onEdit',
            'blur .edit'           : 'onCloseEdit',
            'keypress .edit'       : 'updateOnEnter',
            'click #logOutBtn'     : 'onLogOut'
        },

        initialize: function (opt) {
            var self = this;
            var model;

            this.model = new User({_id: opt.id});
            model = this.model;
            model.fetch({
                success: function (user) {
                    var url = user.urlRoot + '/' + user.id;
                    self.render();
                },
                error  : function () {
                    alert('error');
                }
            });

            this.$el.on('change', '#imageInput', this.pictureAdded);

            this.channel = opt.channel;
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
                aspectRatio: 9 / 9,
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
                    url        : 'users/' + id,
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
                    console.log(idReceived)
                    $('img#canvasImg').removeAttr('src');
                    $('img#canvasImage').removeAttr('src');
                    $('img#image').attr("src", idReceived + '?' + Math.random());
                });
            }
        },

        onRemove: function (e) {
            e.stopPropagation();
            var model = this.model;
            model.destroy({
                wait   : true,
                success: function (model) {
                    console.log('-- Removed ' + model.id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp', {trigger: true});
                },
                error  : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        onHint: function (e) {
            e.stopPropagation();

            var $target = $(e.target);
            var $div = $target.closest('div');
            $div.find('h4#main').hide();
            $div.find('h4#hint').show();
        },

        onHideHint: function (e) {
            e.stopPropagation();

            var $target = $(e.target);
            var $div = $target.closest('div');
            $div.find('h4#hint').hide();
            $div.find('h4#main').show();
        },

        onEdit: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $target = $(e.target);
            var $td = $target.closest('td');
            $td.find('span').hide();
            this.$input = $td.find('input').show();
            this.$input.focus();
        },

        onCloseEdit: function (e) {
            e.stopPropagation();

            var value = this.$input.val();
            var trimmedValue = value.trim();

            var $td = this.$input.closest('td');
            var option = $td.attr('id');

            var changes = {};
            changes[option] = trimmedValue;

            this.model.save(changes, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    var id = model.id;
                    var userUrl = '#myApp/users/account/' + id;
                    console.log('-- Updated id ' + id + ' ----');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp/users/account/' + id, {trigger: true});
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

        onLogOut: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $thisEl = $(e.target);
            var id = $thisEl.attr('name');

            this.model = new User({
                _id: id
            });

            this.model.urlRoot = '/users/logout/';

            this.model.save(null, {
                wait    : true,
                validate: false,
                patch   : true,
                success : function (model) {
                    console.log('-- LoggedOut ---', model.attributes.success);
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#myApp', {trigger: true});
                },
                error   : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {

            var model = this.model.toJSON();
            var idReceived;

            this.$el.html(this.template({model: model}));
            $.ajax({
                url    : 'isAuthAdmin',
                success: function (params) {
                    console.log('success');
                },
                error  : function (error) {
                    $.ajax({
                        async  : false,
                        url    : 'isAuth',
                        success: function (params) {
                            console.log('success 2')
                        },
                        error  : function (error) {
                            Backbone.history.navigate('#myApp/users/create', {trigger: true});
                        }
                    }).done(function (data) {
                        idReceived = data.success;
                        return idReceived;
                    });
                    console.log(model);
                    if (idReceived != model._id) {
                        alert('Access denied');
                        Backbone.history.fragment = '';
                        Backbone.history.navigate('#myApp', {trigger: true});
                    } else if (model.baned == true) {
                        alert('Write us to become unbanned and get access to account');
                        Backbone.history.fragment = '';
                        Backbone.history.navigate('#myApp', {trigger: true});
                    } else if (model.verified == false) {
                        alert('Please verify your e-mail');
                        Backbone.history.fragment = '';
                        Backbone.history.navigate('#myApp', {trigger: true});
                    }
                }
            });
        }

    });
});
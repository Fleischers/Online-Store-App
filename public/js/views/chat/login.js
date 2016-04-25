define([
    'backbone',
    'underscore',
    'text!templates/chat/login.html'
], function (Backbone, _, chatLoginTemplate) {
    var $thisEl;
    var email;
    var password;
    var credentials;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(chatLoginTemplate),

        initialize: function (opt) {
            this.channel = opt.channel;

            this.render();
        },

        events: {
            'click #logInChat'  : 'onLogInChat',
            'click #sendMessage': 'onSend'
        },

        onLogInChat: function (e) {
            $thisEl = this.$el;

            e.stopPropagation();

            email = $thisEl.find('#email').val();
            password = $thisEl.find('#password').val();

            credentials = {
                email   : email,
                password: password
            };
            window.socket.emit('auth', credentials);

            $('div#login-form').hide();
            $('div#hiddenChat').show();

            window.socket.on('message', function (msg) {

                window.socket.room=msg.room;
                console.log(msg);

                var $ul=$('ul#media');
                $ul.append( '<li class="media"><div class="media-body"><div class="media-body">'
                    +msg.message+'<br/><small class="text-muted">'+msg.date+'</small><hr/></div></div></div></li>')
            });
        },

        onSend: function (e) {
            e.stopPropagation();
            $thisEl = this.$el;
            $msg = $thisEl.find('#message').val();
            var room=window.socket.room;

            console.log(room);
            message = {
                message: $msg,
                date: new Date(),
                room: room
            };
            console.log(message);
            console.log(window.socket.room);

            window.socket.emit('message', message);
            var $ul=$('ul#media');
            $ul.append( '<li class="media"><div class="media-body"><div class="media-body" align="right">'
                +message.message+'<br/><small class="text-muted">'+message.date+'</small><hr/></div></div></div></li>')
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

            this.$el.html(this.template());
        }
    });
});

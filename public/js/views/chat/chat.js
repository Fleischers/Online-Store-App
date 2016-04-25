define([
    'backbone',
    'underscore',
    'text!templates/chat/chat.html'
], function (Backbone, _, chatTemplate){
    var $msg;
    var $thisEl;
    var message;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(chatTemplate),

        initialize: function (opt) {
            this.render();

            window.socket.on('message', function (msg) {
                console.log(msg);
                console.log(msg.message);
                console.log(msg.date);
                window.socket.room=msg.room;
                var $ul=$('ul#media');
                $ul.append( '<li class="media"><div class="media-body"><div class="media-body">'
                    +msg.message+'<br/><small class="text-muted">'+msg.date+'</small><hr/></div></div></div></li>')
            });
        },

        events: {
            'click #sendMessage': 'onSend'
        },

        onSend: function(e){
            e.stopPropagation();
            $thisEl=this.$el;
            $msg=$thisEl.find('#message').val();

            message={
                message: $msg,
                date: new Date(),
                room: window.socket.id
            };
            console.log(message);
            console.log('In USER'+window.socket.id);

            window.socket.emit('message', message);

            var $ul=$('ul#media');
            $ul.append( '<li class="media"><div class="media-body" align="right"><div class="media-body">'
                +message.message+'<br/><small class="text-muted">'+message.date+'</small><hr/></div></div></div></li>')

        },

        render: function () {
            this.$el.html(this.template());
        }
    });
});

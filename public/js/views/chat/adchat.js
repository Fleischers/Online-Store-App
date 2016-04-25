define([
    'backbone',
    'underscore',
    'text!templates/chat/adchat.html'
], function (Backbone, _, chatTemplate){
    var $msg;
    var $thisEl;
    var message;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(chatTemplate),

        initialize: function (opt) {
            this.render();
        },

        events: {
            'click #sendMessage': 'onSend'
        },

        onSend: function(e){
            e.stopPropagation();
            $thisEl=this.$el;
            $msg=$thisEl.find('#message').val();

            message={
                message: $msg
            };

            window.socket.emit('message', message);
        },

        render: function () {
            $.ajax({
                url    : 'isAuthAdmin',
                success: function (params) {
                    /*Backbone.history.fragment = '';
                    Backbone.history.navigate('#myAdmin/chat', {trigger: true});*/
                },
                error  : function (error) {
                    Backbone.history.navigate('#myAdmin', {trigger: true});
                }
            });


            this.$el.html(this.template());
        }
    });
});

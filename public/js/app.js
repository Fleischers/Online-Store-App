define([
    /* 'views/users/list'*/
    'backbone',
    'jQuery',
    'router',
    'socket'
], function (Backbone, $, Router, io) {
    function init() {
        var url = window.location.hash;
        window.socket = io.connect('http://localhost:3000');
        var router;

        APP.channel = _.extend({}, Backbone.Events);

        router = new Router({channel: APP.channel});

        window.socket.on('info',function(msg){
            console.log(msg)
        });
        window.socket.on('message',function(msg){
           // console.log(msg)
        });

        window.socket.on('login',function(msg){
            //console.log(msg);
        });

        Backbone.history.start(/*{silent: true}*/);
    }

    return {
        initialize: init
    }
});

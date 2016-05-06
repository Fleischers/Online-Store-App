var APP = APP || {};

require.config({

    paths: {
        cropper    : './libs/cropper/dist/cropper',
        jStorage   : './libs/jStorage/jstorage',
        bootstrap  : './libs/bootstrap/dist/js/bootstrap',
        underscore : './libs/underscore/underscore',
        jQuery     : './libs/jquery/dist/jquery',
        backbone   : './libs/backbone/backbone',
        text       : './libs/text/text',
        templates  : '../templates',
        models     : './models',
        collections: './collections',
        views      : './views',
        socket     : './libs/socket.io-client/socket.io'
    },

    shim: {
        underscore: {
            exports: '_'
        },
        cropper   : ['jQuery'],
        jStorage  : ['jQuery'],
        bootstrap : ['jQuery'],
        backbone  : ['underscore', 'jQuery'],
        app       : ['bootstrap', 'backbone', 'jStorage', 'cropper', 'socket']
    }
});

require(['app', 'socket'], function (app, socket) {
    var io = socket();
    io.on('customSocket', function (data) {
        console.log(data);
        io.emit('response', '............. dcsd .........')
    });
    io.on('info', function (msg) {
        console.log(msg)
    });
    io.on('message', function (msg) {
        console.log(msg)
    });
    io.emit('auth', '............. dcsd .........');

    app.initialize();
});
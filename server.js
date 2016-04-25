var express = require('express');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var cons = require('consolidate');
var html = require('html');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var Chat = require('./chat');
var env = process.env;
var db;
require('./config/' + env.NODE_ENV);

mongoose.connect(env.DB_HOST, env.DB_NAME, env.DB_PORT /*{user: env.DB_USER,pass: env.DB_PASS}*/);
db = mongoose.connection;
db.on('error', function (err) {
    console.error(err);
});

db.once('connected', function () {
    var sessionConfig;
    var server;
    var sockets;
    var app;

    sessionConfig = {
        mongooseConnection: db
    };

    console.log('==== Connected to DB ====');
    app = express();
    server=http.createServer(app);

    var chat = new Chat(server);
    chat.init();

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', function (req, res, next) {
        res.sendFile(__dirname + '/index.html');
    });

    app.engine('html', cons.underscore);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'html');
    app.use(cookieParser());

    app.use(session({
        name             : 'online_store',
        key              : "superSecretKey",
        secret           : '1q2w3e4r5tdhgkdfhgejflkejgkdlgh8j0jge4547hh',
        resave           : false,
        saveUninitialized: false,
        store            : new MongoStore(sessionConfig)
    }));

    routes(app);

    server.listen(env.PORT || 3000, function() {
        console.log('==== Server started ====');
    })
});

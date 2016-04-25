'use strict';

require('should');
var io = require('socket.io-client');
var Chat = require('./../chat');
var winston = require('winston');
var User = require('./../models/user');

var PORT = 3001;
var WAIT_TIME = 1000;
var SEND_TIME = 10;
var chat;

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  colorize: true,
  level: 'debug',
  prettyPrint: true,
  humanReadableUnhandledException: true
});

before('set module port', function () {
  chat = new Chat(PORT);
});

describe('Websocket connection', function () {
  // TODO change hardcoded host
  var socket;
  var socket2;
  var socket3;

  before('should set port for chat module', function (done) {
    chat.init();
    socket = new io('http://localhost:' + PORT);

    socket.on('connect', function () {
      socket.on('info', function (msg) {
        winston.info(msg);
      });

      socket.on('message', function (msg) {
        winston.info(msg);
      });

      socket.on('login', function (msg) {
        winston.info(msg);
      });
      done();
    });
  });

  it('should send message', function() {
    setTimeout(function () {
      socket.send('message', {content: 'json'});
    }, SEND_TIME);
  });

  it.skip('should disconnect', function (done) {
    var WAIT_TIME = 100;

    socket.disconnect();
    setTimeout(function () {
      done();
    }, WAIT_TIME);

  });

  it.skip('should connect again', function (done) {
    socket = io('http://localhost:' + PORT);
    socket.on('connect', function () {
      socket.emit('message', {content: 'json'});
      done();
    });
  });

  describe('Admin', function () {
    User.checkAdmin = function (email, password, callback) {
      winston.info('here in user');
      winston.debug(email, password);
      return callback();
    }


    before('should make connection', function (done) {
      socket2 = new io('http://localhost:' + PORT);

      socket2.on('connect', function () {
        winston.debug('socket2 on connect');

        socket2.on('info', function (msg) {
          winston.info('socket2#info:', msg);
        });

        socket2.on('message', function (msg) {
          winston.info('socket2#message:', msg);
        });

        socket2.on('login', function (msg) {
          winston.info('socket2#login:', msg);
        });
        done();
      });

    });

    it('should make auth', function () {
      socket2.emit('auth', {email: 'vas', password: 'pass'});
    });

    it('should emit message from user to admin', function () {
      setTimeout(function () {
        socket.emit('message', {content: 'Hello, I am User One!', room: socket.id});
      }, SEND_TIME);
    });

    it('should emit message to room with user', function () {
      setTimeout(function () {
        socket2.emit('message', {content: 'Hello User One!', room: socket.id});
      }, SEND_TIME*2);
    });

    after('should wait and disconnect', function (done) {

      setTimeout(function () {
        socket.disconnect();

        done();
      }, WAIT_TIME);
    });
  });
  describe('User 3', function () {

    before('should make 3 connection', function (done) {
      socket3 = new io('http://localhost:' + PORT);

      socket3.on('connect', function () {
        winston.debug('socket3 on connect');

        socket3.on('info', function (msg) {
          winston.info('socket3#info:', msg);
        });

        socket3.on('message', function (msg) {
          winston.info('socket3#message:', msg);
        });

        done();
      });

    });

    it('should send message  user3 to admin', function () {
      setTimeout(function () {
        socket3.emit('message', {content: 'Hello Admin! From user 3', room: socket3.id});
      }, SEND_TIME*4);
    });

    it('should send message to user3 from admin', function () {
      setTimeout(function () {
        socket2.emit('message', {content: 'Hello User3!', room: socket3.id});
      }, SEND_TIME*10);
    });

    after('should wait and disconnect', function (done) {

      setTimeout(function () {
        socket3.disconnect();

        done();
      }, WAIT_TIME);
    });
  });

});

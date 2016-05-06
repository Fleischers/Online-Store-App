'use strict';

var SocketServer = require('socket.io');
var winston = require('winston');
var shortid = require('shortid');
var _ = require('lodash');
var User = require('./../models/user');

var CHAT = {
    info: 'info',
    message: 'message'
};
var AUTH_FAIL_MESSAGE = 'auth fail';

var io;
var history = new Map();

function Chat(options) {
    io = SocketServer(options);
}

Chat.prototype.adminIsPresent = function () {
    if (this.admin) {
        return true;
    } else {
        return false;
    }
};

function adminSubscribtions(self, socket) {
    self.admin.emit(CHAT.info, {
        status: 0,
        message: 'New user connected',
        room: socket.id
    });
    self.admin.join(socket.id);

    socket.on(CHAT.message, function onMessage(msg) {
        var responseMessage = _.cloneDeep(msg);
        if (_.isObject(responseMessage) || !_.isString(
                responseMessage)) {
            responseMessage.date = new Date();
            responseMessage._id = shortid.generate();
            history.set(responseMessage._id,
                responseMessage);

            winston.debug('message:',
                responseMessage);
            if (socket == self.admin) {
                socket.broadcast.to(msg.room).emit(
                    CHAT.message,
                    responseMessage);
            } else {
                socket.broadcast.to(self.admin.id).emit(
                    CHAT.message,
                    responseMessage);
            }
        } else {
            socket.emit(CHAT.info, {
                status: 500,
                message: 'message should be object'
            });
        }
    });
}

Chat.prototype.init = function () {
    var self = this;

    io.on('connection', function (socket) {
        winston.debug('user connection');

        if (self.adminIsPresent()) {
            adminSubscribtions(self, socket);
        } else {
            socket.on(CHAT.message, function onMessage(msg) {
                if (self.adminIsPresent()) {
                    adminSubscribtions(self, socket);
                } else {
                    socket.emit(CHAT.info, {
                        status: 404,
                        message: 'There is no admin'
                    });
                }
            });
            socket.on('auth', function (msg) {
                console.log(msg);
                User.checkAdmin(msg.email, msg.password,
                    function (err) {
                        if (err) {
                            winston.error(
                                AUTH_FAIL_MESSAGE,
                                err);
                            socket.emit(CHAT.info, {
                                status: 401,
                                message: AUTH_FAIL_MESSAGE,
                                error: err
                            });
                            return;
                        }
                        /*socket.emit('info', {
                         status: 200,
                         message: AUTH_FAIL_MESSAGE,
                         error: err
                         });*/
                        socket.emit('login',{
                            status: 200,
                            message: 'good luck'
                        });
                        self.admin = socket;
                        adminSubscribtions(self, socket);
                    });
            });
        }

        socket.on('disconnect', function onDisconnect() {
            var status = {
                status: 0,
                code: 0,
                message: 'user disconnected'
            };
            winston.debug(status);

            if (self.admin) {
                self.admin.emit('update rooms', status);
                if (self.admin.id == socket.id) {
                    io.emit('offline');
                    self.admin = null;
                }
            }
            socket.emit(CHAT.info, status);
        });

        socket.on('error', function (error) {
            // speaks while holding a bow in his hands:
            var failMessage =
                'You have failed this server!';
            winston.error(failMessage, error);
            socket.emit(CHAT.info, {
                status: 501,
                message: failMessage,
                error: error
            });
        });

        socket.emit('customSocket', 'dhdhdhdh----');
    });

};

module.exports = Chat;
// CUSTOM ERRORS => ToDo REFACTOR
var util = require('util');
var http = require('http');

function HttpError(status, message) {
    Error.apply(this, arguments);
    if (process.env.NODE_ENV === 'development') {
        Error.captureStackTrace(this, HttpError);
    }

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || "Error";
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';
exports.HttpError = HttpError;

function AuthError(message) {
    Error.apply(this, arguments);
    if (process.env.NODE_ENV === 'development') {
        Error.captureStackTrace(this, AuthError);
    }

    this.message = message;
}

util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';
exports.AuthError = AuthError;


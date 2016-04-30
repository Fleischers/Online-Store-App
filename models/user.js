var crypto = require('crypto');
var async = require('async');
var util = require('util');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var AuthError = require('../handlers/customError').AuthError;
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    role          : {
        type   : Number,
        default: 1
    },
    firstName     : {
        type    : String,
        required: true
    },
    lastName      : {
        type    : String,
        required: true
    },
    address       : {type: String},
    phone         : {
        type    : String,
        required: true
    },
    email         : {
        type    : String,
        unique  : true,
        required: true
    },
    hashedPassword: {
        type    : String,
        required: true
    },
    salt          : {
        type    : String,
        required: true
    },
    birthday      : {type: Date},
    created       : {
        type   : Date,
        default: Date.now
    },
    lastVisit     : {type: Date},
    baned         : {
        type   : Boolean,
        default: false
    },
    avatar        : {type: String},
    orders        : [{
        type: Schema.Types.ObjectId,
        ref : 'order'
    }],
    productReview : [{
        type: Schema.Types.ObjectId,
        ref : 'productReview'
    }],
    verified      : {
        type   : Boolean,
        default: false
    },
    sms           : {
        type   : Number,
        expires: 60 * 60
    },
    resetPassCode : {
        type   : Number,
        expires: 60 * 60
    },
    smsExpire: {type: Date},
    resetPassCodeExpire: {type: Date}
});

UserSchema.plugin(deepPopulate);

UserSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

UserSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

UserSchema.statics.checkAdmin = function (email, password, callback) {
    var User = this;

    console.log(email);

    async.waterfall([
        function (callback) {
            User.findOne({email: email}, callback);
        },
        function (user, callback) {
            if (user) {
                if ((user.encryptPassword(password) === user.hashedPassword) && (user.role == 0)) {
                    callback(null, user);
                } else {
                    callback(new AuthError('You R NOT ADMIN! GoAWAY!'));
                }
            } else {
                callback(new AuthError('There\'s no user with such email'));
            }
        }
    ], callback);
};

UserSchema.statics.checkPassword = function (email, password, sms, callback) {
    var User = this;

    async.waterfall([
        function (callback) {
            console.log(email, password);
            User.findOne({email: email}, callback);
        },
        function (user, callback) {
            if (user) {
                if ((user.encryptPassword(password) === user.hashedPassword) && (user.sms == sms)) {
                    callback(null, user);
                } else {
                    callback(new AuthError('Forgot your password?'));
                }
            } else {
                callback(new AuthError('There\'s no user with such email'));
            }
        }
    ], callback);
};

UserSchema.statics.authorize = function (firstname, lastname, email, password, phone, callback) {
    var User = this;

    async.waterfall([
        function (callback) {
            User.findOne({email: email}, callback);
        },
        function (user, callback) {
            if (user) {
                callback(new AuthError('User with such email exists'));
            } else {
                user = new User({
                    firstName: firstname,
                    lastName : lastname,
                    email    : email,
                    password : password,
                    phone    : phone
                });
                user.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    callback(null, user);
                });
            }
        }
    ], callback);
};

module.exports = mongoose.model('user', UserSchema);
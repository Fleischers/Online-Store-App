var env = process.env;
require('../config/' + env.NODE_ENV);
var multiparty = require('multiparty');
var validator = require('validator');
var fs = require('fs');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');
var nodemailer = require('nodemailer');
var HttpError = require('./customError').HttpError;
var AuthError = require('./customError').AuthError;
var client = require('twilio')(env.TWILIO_SID, env.TWILIO_TOKEN);

module.exports = function () {
    var rand;
    var mailOptions;
    var host;
    var link;
    var id;
    var firstname;
    var lastname;
    var email;
    var password;
    var phone;
    var form;
    var uploadFile;
    var extention;
    var maxSize;
    var supportMimeTypes;
    var errors;
    var out;
    var body;
    var orders;
    var productReview;
    var avatar;
    var birthday;
    var role;
    var sms;
    var user;
    var toEmail;
    var smtpTransport;
    var pass;
    var code;
    var max;
    var min;
    var random;

    this.validateData = function (req, res, next, id) {

        if (!validator.isMongoId(id)) {

            return next(new HttpError(403, 'Invalid ID'));
        }

        User.find({_id: id}, function (err, users) {
            if (err) {
                next(err);
            } else if (users) {

                if (Object.keys(users).length != 0) {
                    next();
                } else {
                    next(new HttpError(400, 'Empty user'));
                }

            } else {
                next(new HttpError(400, 'Failed to load user'));
            }
        });
    };

    this.countModels = function (req, res, next) {
        User.count({}, function (err, count) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: count});
        })
    };

    this.fetch = function (req, res, next) {
        var sort;
        var page;
        var paginate;
        sort = req.query.sort;
        paginate = +req.query.count;
        page = req.query.page;
        if (sort) {
            var index = sort.indexOf(':');
            var field = sort.substring(0, index);
            var rule = sort.substring(index + 1);
            if (field == 'email') {
                sort = {email: rule};
            } else if (field == 'created') {
                sort = {created: rule};
            }
        }

        User
            .find({}, {__v: 0, salt: 0, hashedPassword:0})
            .skip((page - 1) * paginate)
            .limit(paginate)
            .sort(sort)
            .exec(function (err, users) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(users);
            })
    };

    this.fetchById = function (req, res, next) {
        id = req.params.id;

        User
            .findById(id, {
                __v           : 0,
                hashedPassword: 0,
                salt          : 0,
                role          : 0,
                created       : 0
            })
            .populate({
                path  : 'orders',
                select: 'totalPrice status created'
            })
            .deepPopulate('productReview.product', {
                populate: {
                    'productReview.product': {
                        select: 'name -_id'
                    }
                }
            })
            .exec(function (err, users) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(users);
            })
    };

    this.createUser = function (req, res, next) {
        firstname = req.body.firstName;
        lastname = req.body.lastName;
        email = req.body.email;
        password = req.body.password;
        phone = req.body.phone;

        if (!(validator.isAlpha(firstname) && validator.isAlpha(lastname))) {

            return next(new HttpError(400, 'Your name is not real name'))
        }

        if (!(validator.isEmail(email))) {

            return next(new HttpError(400, 'This is not email'))
        }

        if (!(validator.isAlphanumeric(password))) {

            return next(new HttpError(400, 'Password can only contain letters or numbers'))
        }

        User.authorize(firstname, lastname, email, password, phone, function (err, user) {
            if (err) {
                if (err instanceof AuthError) {
                    return next(new HttpError(403, err.message));
                } else {

                    return next(err);
                }
            }

            req.user = user;
            next();
        });
    };

    this.saveImage = function (req, res, next) {
        form = new multiparty.Form();
        id = req.params.id;
        uploadFile = {
            path: '',
            size: '',
            type: ''
        };

        maxSize = 2 * 1024 * 1024;
        supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        errors = [];

        form.on('error', function (err) {
            if (err) {
                next()
            }

            // ToDO: удалять файлы, название которых - _id, игнорировать разрешение !!!
            if (fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }

        });
        form.on('part', function (part) {

            uploadFile.size = part.byteCount;
            uploadFile.type = part.headers['content-type'];
            extention = (uploadFile.type).substring((uploadFile.type).indexOf('/') + 1).toString();
            uploadFile.path = './public/images/avatars/' + id + '.' + extention;
            if (uploadFile.size > maxSize) {
                errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
            }

            if (supportMimeTypes.indexOf(uploadFile.type) == -1) {
                errors.push('Unsupported mimetype ' + uploadFile.type);
            }
            if (errors.length != 0) {

                return next(new HttpError(400, errors));
            }

            out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        });
        form.on('close', function () {
            console.log('Upload completed!');
            console.log((uploadFile.path).substr([9]));
            req.body.avatar = (uploadFile.path).substr(9);
            next();
        });
        form.parse(req);
    };

    // if updating from browser PATCH request is required
    this.updateUser = function (req, res, next) {

        body = req.body;
        orders = req.body.orders || [];
        productReview = req.body.productReviews || [];
        id = req.params.id;
        avatar = req.body.avatar;
        birthday = req.body.birthday;
        role = req.body.role;

        if (orders && !(orders instanceof Array)) {
            orders = [orders];
        }

        if (!(productReview instanceof Array)) {
            productReview = [productReview];
        }

        if (role == 0) {

            return next(new HttpError(403, 'It is forbidden to change role'));
        }

        if (birthday) {
            if (!(validator.isDate(birthday))) {

                return next(new HttpError(400, 'Birthday must be a date'));
            }
        }

        if (avatar) {
            User.findByIdAndUpdate(id, {$set: {avatar: avatar}})
                .exec(function (err, users) {
                    if (err) {

                        return next(err);
                    }

                    res.redirect('http://localhost:3000/#myApp/users/account/' + id);
                });
        } else if (orders.length > 0) {
            User.findByIdAndUpdate(id, {$push: {"orders": {_id: orders}}}, {
                    safe  : true,
                    upsert: true
                })
                .exec(function (err, users) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send({success: orders.toString()});
                });
        } else if (productReview.length > 0) {
            User.findByIdAndUpdate(id, {$push: {"productReview": {_id: productReview}}}, {
                    safe  : true,
                    upsert: true
                })
                .exec(function (err, users) {
                    if (err) {

                        return next(err);
                    }
                    req.params.id = req.body.product;
                    next();
                });
        } else {
            User
                .findByIdAndUpdate(id, {$set: body})
                .exec(function (err, users) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send(users);
                })
        }

    };

    this.deleteById = function (req, res, next) {
        id = req.params.id;

        User
            .findByIdAndRemove(id)
            .exec(function (err, users) {
                if (err) {
                    return next(err);
                }

                req.session.logged = false;
                req.session._id = null;
                req.body.ids = users.productReview;
                next();
            })
    };

    this.logIn = function (req, res, next) {
        var time;
        var date = new Date();
        email = req.body.email;
        password = req.body.password;
        sms = req.body.sms;

        if ((!(email)) || (!(password))) {

            return next(HttpError(400, 'You haven\'t put in email or password'));
        }

        User.checkPassword(email, password, sms, function (err, users) {
            if (err) {
                if (err instanceof AuthError) {

                    return next(new HttpError(403, err.message));
                } else {

                    return next(err);
                }
            }

            time = date - users.smsExpire;
            console.log(time);
            if (time > 60 * 1000) {
                return next(new HttpError(403, 'Your sms expired')); //ERROR TIME
            }

            delete users.password;
            req.session.logged = true;
            req.session._id = users._id;
            req.session.role = false;
            res.status(200).send({success: req.session._id});
        });
    };

    this.isAdmin = function (req, res, next) {
        email = req.body.email;
        password = req.body.password;

        User.checkAdmin(email, password, function (err, users) {
            if (err) {
                if (err instanceof AuthError) {

                    return next(new HttpError(403, err.message));
                } else {

                    return next(err);
                }
            }

            delete users.password;
            req.session.logged = true;
            req.session._id = users._id;
            req.session.role = true;
            res.status(200).send({success: req.session._id});
        });
    };

    this.isAuth = function (req, res, next) {

        if (req.session && req.session.logged) {

            return res.status(200).send({success: req.session._id});
        }

        return next(new AuthError(401, 'Please, log in!'));
    };

    this.isAuthAdmin = function (req, res, next) {

        if (req.session && req.session.logged && req.session.role) {

            return res.status(200).send({success: req.session._id});
        }

        return next(new AuthError(401, 'Please, log in!'));
    };

    this.logOut = function (req, res, next) {
        id = req.params.id;

        User.find({_id: id}, function (err, users) {
            if (err) {

                return next(new AuthError(401, 'Smth wrong'));
            }

            req.session.logged = false;
            req.session._id = null;
            res.status(200).send({success: req.session});
        })
    };

    this.sendEmail = function (req, res) {
        user = req.user;
        toEmail = req.user.email;
        smtpTransport = nodemailer.createTransport("SMTP", {
            service: env.EMAIL_SERVICE,
            auth   : {
                user: env.EMAIL,
                pass: env.EMAIL_PASS
            }
        });

        rand = Math.floor((Math.random() * 100) + 54);
        host = req.get('host');
        link = "http://" + req.get('host') + "/users/verify?id=" + rand;
        mailOptions = {
            to     : toEmail,
            subject: 'Please confirm your Email account',
            html   : 'Hello,<br> Please Click on the link to verify your email.<br>' + link
        };
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.end("error");
            } else {
                console.log("Message sent: " + response.message);
                res.status(200).send(user);
            }
        });
    };

    this.verifyEmail = function (req, res, next) {
        email = mailOptions.to;

        //console.log(req.protocol + ":/" + req.get('host'));
        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {

            //console.log("Domain is matched. Information is from Authentic email");
            if (req.query.id == rand) {
                User.findOneAndUpdate({email: email}, {$set: {verified: true}})
                    .exec(function (err, users) {
                        if (err) {

                            return next(err);
                        }

                        res.redirect('http://localhost:3000/#myApp/users/create');
                    });
            }
            else {

                res.end("<h1>Bad Request</h1>");
            }
        }
        else {
            res.end("<h1>Request is from unknown source</h1>");
        }
    };

    this.forgotPass = function (req, res, next) {

        console.log('forgotPass');
        email = req.body.email;
        if (!email) {
            throw new HttpError(400, 'You haven\'t put in email');
        }

        rand = Math.floor((Math.random() * 10000000) + 787);
        User.findOneAndUpdate({email: email}, {
            resetPassCode      : rand,
            resetPassCodeExpire: new Date()
        }, {}, function (err, user) {
            if (err) {
                return next(HttpError(400, 'Failed to load the user'));
            }
            if (!user) {
                return next(HttpError(400, 'Failed to load the user'));
            }

            toEmail = user.email;
            smtpTransport = nodemailer.createTransport('SMTP', {
                service: env.EMAIL_SERVICE,
                auth   : {
                    user: env.EMAIL,
                    pass: env.EMAIL_PASS
                }
            });

            host = req.get('host');
            link = 'http://' + host + "/users/resetPass/" + rand;
            mailOptions = {
                to     : toEmail,
                subject: 'Reset your password',
                html   : 'Hello,<br> Please Click on the link to reset your password.<br><a href="' + link + '">Click here to reset</a>'
            };

            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {

                    console.log(error);
                    res.end("error");
                } else {

                    console.log("Message sent: " + response.message);
                    res.status(200).send(user);
                }
            });
        });
    };

    this.confirmLink = function (req, res, next) {
        var time;
        var code = req.params.token;
        var date = new Date();

        console.log(code);
        User.findOne({resetPassCode: code}, function (err, users) {
            if (err) {
                return next(err);
            }

            if (users == null) {
                return next(err);
            }
            time = date - users.resetPassCodeExpire;
            console.log(time);
            if (time > 60 * 60 * 1000) {
                return next(new HttpError(403, 'Your sms expired'));
            }
            res.redirect('http://localhost:3000/#myApp/resetPass/' + users.resetPassCode);
        });
    };

    this.resetPass = function (req, res, next) {
        code = req.body.resetPassCode;
        pass = req.body.pass;

        if (!pass) {
            throw new HttpError(400, 'There is no pass');
        }

        if (!code) {
            throw new HttpError(400, 'Empty code');
        }

        User.findOne({resetPassCode: code}, 'salt email', function (err, user) {

            if (err) {

                return next(err);
            }

            User.findOneAndUpdate({email: user.email}, {
                hashedPassword: user.encryptPassword(pass),
                resetPassCode : null
            }, {}, function (err, users) {
                if (err) {

                    return next(err);
                }

                console.log('pass changed');
                res.status(200).send(users);
            });
        });
    };

    this.sendSms = function (req, res, next) {

        email = req.body.email;
        max = 999999;
        min = 100000;
        random = Math.floor(Math.random() * (max - min + 1)) + min;

        if (!email) {
            throw new HttpError(400, 'You haven\'t put in email');
        }

        User.findOne({email: email})
            .exec(function (err, users) {
                if (err) {

                    return next(HttpError(400, 'Failed to load the user'));
                }

                if (!users) {

                    return next(HttpError(400, 'Failed to load the user'));
                }

                client.sendMessage({
                    to  : users.phone,
                    from: '+14133155913',
                    body: random
                }, function (err, data) {
                    if (err) {

                        return next(HttpError(400, 'Something wrong, try later'));
                    }
                    sms = (data.body).slice(-6);

                    console.log(sms);
                    users.sms = sms;
                    users.smsExpire = new Date();
                    users.save(function (err) {
                        if (err) {
                            return next(HttpError(400, 'You haven\'t put in email or password'));
                        } else {
                            console.log('success');
                        }
                    });
                });
                res.status(200).send({success: users.phone});
            });
    }
};


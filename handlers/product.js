var multiparty = require('multiparty');
var validator = require('validator');
var fs = require("fs");
var async = require('async');
var HttpError = require('./customError').HttpError;
var Product = require('../models/product');

module.exports = function () {
    var query;
    var filter;
    var regex;
    var paginate;
    var page;
    var id;
    var products;
    var product;
    var body;
    var form;
    var uploadFile;
    var maxSize;
    var extention;
    var supportMimeTypes;
    var errors;
    var out;
    var productReviews;
    var image;
    var categories;

    this.validateData = function (req, res, next, id) {

        if (!validator.isMongoId(id)) {
            return next(new HttpError(400, 'Invalid ID'));
        }

        Product.find({_id: id}, function (err, products) {
            if (err) {
                next(err);
            } else if (products) {
                for (var any in products) {
                }
                if (products.hasOwnProperty(any)) {
                    next();
                } else {
                    next(new HttpError(400, 'Failed to load product'));
                }
            } else {
                next(new HttpError(400, 'Failed to load product'));
            }
        });
    };

    this.fetch = function (req, res, next) {
        query = req.query.filter;
        paginate = req.query.count;
        page = req.query.page;

        if (query) {
            regex = new RegExp(query, "i");
            filter = {name: regex}
        } else {
            filter = {}
        }

        Product
            .find(filter, {__v: 0})
            .populate({
                path  : 'categories',
                select: 'name -_id'
            })
            .populate({
                path  : 'productReviews',
                select: 'description -_id'
            })
            .skip((page - 1) * paginate)
            .limit(paginate)
            .exec(function (err, products) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(products);
            })
    };

    // ToDo: при deepPopulate вываливается куча ненужной инфы, нужно придумать как ее убрать
    // и оставить только поле postedBy
    this.fetchById = function (req, res, next) {
        id = req.params.id;

        Product
            .findById(id, {__v: 0})
            .populate({
                path  : 'categories',
                select: 'name -_id'
            })
            .deepPopulate('productReviews.postedBy', {
                populate: {
                    'productReviews.postedBy': {
                        select: 'firstName avatar'
                    }
                }
            })
            .exec(function (err, products) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(products);
            })
    };

    this.createProduct = function (req, res, next) {
        body = req.body;
        product = new Product(body);

        product
            .save(function (err, products) {
                if (err) {

                    return next(err);
                }

                res.status(201).send({_id: products._id});
            })
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

            // удалить файл, если нужно обновить изображение, но у него уже есть
            // ToDO: удалять файлы, название которых - _id, игнорировать разрешение !!!
            if (fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
        });
        form.on('part', function (part) {
            uploadFile.size = part.byteCount;
            uploadFile.type = part.headers['content-type'];
            extention = (uploadFile.type).substring((uploadFile.type).indexOf('/') + 1).toString();
            uploadFile.path = './public/images/products/' + id + '.' + extention;

            if (uploadFile.size > maxSize) {
                errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
            }

            if (supportMimeTypes.indexOf(uploadFile.type) == -1) {
                errors.push('Unsupported mimetype ' + uploadFile.type);
            }
            if (errors.length != 0) {
                throw new HttpError(400, errors);
            }

            out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        });
        form.on('close', function () {
            console.log('Upload completed!');
            console.log((uploadFile.path).substr([9]));
            req.body.image = (uploadFile.path).substr(9);
            next();
        });
        form.parse(req);
    };

    this.updateProduct = function (req, res, next) {
        body = req.body;
        id = req.params.id;
        productReviews = body.productReviews;
        image = body.image;
        categories = req.body.categories;

        if (image) {
            Product.findByIdAndUpdate(id, {$set: {image: image}})
                .exec(function (err, products) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send({success: products.image});
                });
        } else if (categories) {
            Product.findByIdAndUpdate(id, {$push: {"categories": {_id: categories}}}, {
                    safe  : true,
                    upsert: true
                })
                .exec(function (err, products) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send({success: products});
                })
        } else if (productReviews) {
            Product.findByIdAndUpdate(id, {$push: {"productReviews": {_id: productReviews}}}, {
                    safe  : true,
                    upsert: true
                })
                .exec(function (err, products) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send(products);
                })
        } else {
            Product
                .findByIdAndUpdate(id, {$set: body})
                .exec(function (err, products) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send(products);
                })
        }
    };

    this.deleteById = function (req, res, next) {
        id = req.params.id;

        Product
            .findByIdAndRemove(id)
            .exec(function (err, products) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(products);
            })
    };
};

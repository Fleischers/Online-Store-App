var multiparty = require('multiparty');
var validator = require('validator');
var fs = require("fs");
var async = require('async');
var HttpError = require('./customError').HttpError;
var Category = require('../models/category');

module.exports = function () {
    var query;
    var paginate;
    var page;
    var filter;
    var id;
    var body;
    var category;
    var form;
    var uploadFile;
    var maxSize;
    var extention;
    var supportMimeTypes;
    var errors;
    var out;
    var products;
    var image;
    
    this.validateData = function (req, res, next, id) {

        if (!validator.isMongoId(id)) {

            return next(new HttpError(400, 'Invalid ID'));
        }

        Category.find({_id: id}, function (err, categories) {
            if (err) {

                next(err);
            } else if (categories) {
                for (var any in categories) {
                }
                if (categories.hasOwnProperty(any)) {
                    next();
                } else {

                    next(new HttpError(400, 'Failed to load user'));
                }
            } else {

                next(new HttpError(400, 'Failed to load user'));
            }
        });
    };

    this.countModels = function (req, res, next) {
        Category.count({}, function (err, count) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: count});
        })
    };

    this.fetch = function (req, res, next) {
        var sort;
        query = req.query.filter;
        paginate = req.query.count;
        page = req.query.page;
        sort=req.query.sort;

        if (query) {
            filter = {name: query}
        } else {
            filter = {}
        }

        if(sort){
            var index=sort.indexOf(':');
            var field=sort.substring(0,index);
            var rule=sort.substring(index+1);
            if(field=='name'){
                sort={name: rule};
            }else if(field=='created'){
                sort={created: rule};
            }
        }

        Category.find(filter, {
                __v    : 0,
                created: 0
            })
            .populate({
                path   : 'products',
                select : 'name price description statusEnabled image',
                options: {limit: 20}
            })
            .skip((page - 1) * paginate)
            .limit(paginate)
            .sort(sort)
            .exec(function (err, categories) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(categories);
            })
    };

    this.fetchById = function (req, res, next) {
        id = req.params.id;

        Category
            .findById(id, {
                __v    : 0,
                created: 0
            })
            .populate({
                path   : 'products',
                select : 'name price description statusEnabled image',
                options: {limit: 20}
            })
            .exec(function (err, categories) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(categories);
            })
    };

    this.createCategory = function (req, res, next) {
        body = req.body;
        category = new Category(body);

        category
            .save(function (err, categories) {
                if (err) {

                    return next(err);
                }

                res.status(201).send({_id: category._id});
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

            // удалить файл, если у юзер хочет новую аву, но у него уже есть
            // ToDO: удалять файлы, название которых - _id, игнорировать разрешение !!!
            if (fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
        });
        form.on('part', function (part) {
            uploadFile.size = part.byteCount;
            uploadFile.type = part.headers['content-type'];
            extention = (uploadFile.type).substring((uploadFile.type).indexOf('/') + 1).toString();
            uploadFile.path = './public/images/categories/' + id + '.' + extention;

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
            console.log((uploadFile.path).substr(9));
            req.body.image = (uploadFile.path).substr(9);
            next();
        });
        form.parse(req);
    };

    this.updateCategory = function (req, res, next) {
        body = req.body;
        id = req.params.id;
        products = body.products;
        image = req.body.image;
        console.log(products);

        if (image) {
            Category.findByIdAndUpdate(id, {$set: {image: image}})
                .exec(function (err, categories) {
                    if (err) {

                        return next(err);
                    }

                    res.redirect('http://localhost:3000/#myAdmin/categories/' + id);
                })
        } else if (products) {
            Category.findByIdAndUpdate(id, {$push: {"products": {_id: products}}}, {
                    safe  : true,
                    upsert: true
                })
                .exec(function (err, categories) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send({success: categories});
                })
        } else {
            Category
                .findByIdAndUpdate(id, {$set: body})
                .exec(function (err, categories) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send(categories);
                })
        }

    };

    this.deleteById = function (req, res, next) {
        id = req.params.id;

        Category
            .findByIdAndRemove(id)
            .exec(function (err, categories) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(categories);
            })
    };
};

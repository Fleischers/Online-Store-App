var validator = require('validator');
var HttpError = require('./customError').HttpError;
var ProductReview = require('../models/productReview');

module.exports = function () {
    var id;
    var body;
    var productReview;

    this.validateData = function (req, res, next, id) {

        if (!validator.isMongoId(id)) {

            return next(new HttpError(400, 'Invalid ID'));
        }

        ProductReview.find({_id: id}, function (err, productReviews) {
            if (err) {
                next(err);
            } else if (productReviews) {
                for (var any in productReviews) {
                }
                if (productReviews.hasOwnProperty(any)) {
                    next();
                } else {
                    next(new HttpError(400, 'Failed to load'));
                }
            } else {
                next(new HttpError(400, 'Failed to load'));
            }
        });
    };

    this.fetch = function (req, res, next) {

        ProductReview
            .find({}, {
                __v    : 0,
                created: 0
            })
            .populate({
                path  : 'postedBy',
                select: 'firstName description avatar'
            })
            .populate({
                path  : 'product',
                select: 'name'
            })
            .limit(20)
            .exec(function (err, productReviews) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(productReviews);
            })
    };

    this.fetchById = function (req, res, next) {
        id = req.params.id;

        ProductReview
            .findById(id, {
                __v    : 0,
                created: 0
            })
            .populate({
                path  : 'postedBy',
                select: 'firstName description avatar'
            })
            .populate({
                path  : 'product',
                select: 'name'
            })
            .limit(20)
            .exec(function (err, productReviews) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(productReviews);
            })
    };

    this.createProductReview = function (req, res, next) {
        body = req.body;
        productReview = new ProductReview(body);
        productReview
            .save(function (err, productReviews) {
                if (err) {

                    return next(err);
                }

                req.params.id = productReviews.postedBy;
                req.body.product = productReviews.product;
                req.body.productReviews = productReviews._id;
                next();
            })
    };

    this.updateProductReview = function (req, res, next) {
        body = req.body;
        id = req.params.id;

        ProductReview
            .findByIdAndUpdate(id, {$set: body})
            .exec(function (err, productReviews) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(productReviews);
            })
    };

    this.deleteById = function (req, res, next) {
        var ids;

        ids = req.body.ids;
        console.log(ids);
        if (ids.length != 0) {
            ids.forEach(function (item) {
                ProductReview
                    .findByIdAndRemove(item)
                    .exec(function (err, productReviews) {
                        if (err) {
                            return next(err);
                        }
                    })
            });
        }
        res.status(200).send({success: 'success'})
    };
};

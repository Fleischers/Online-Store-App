var validator = require('validator');
var fs = require("fs");
var async = require('async');
var HttpError = require('./customError').HttpError;
var Order = require('../models/order');

module.exports = function () {
    var query;
    var filter;
    var paginate;
    var page;
    var id;
    var order;
    var products;
    var itemsQuantity;
    var customerInfo;
    var total;
    var body;
    var totalPrice;

    this.validateData = function (req, res, next, id) {

        if (!validator.isMongoId(id)) {
            return next(new HttpError(400, 'Invalid ID'));
        }

        Order.find({_id: id}, function (err, orders) {
            if (err) {
                next(err);
            } else if (orders) {
                for (var any in orders) {
                }
                if (orders.hasOwnProperty(any)) {
                    next();
                } else {
                    next(new HttpError(400, 'Failed to load user'));
                }
            } else {
                next(new HttpError(400, 'Failed to load user'));
            }
        });
    };

    // ToDo: отображение продуктов и информации о клиенте
    // ОДНОВРЕМЕННО на запроc "?expand=products&expand=customerInfo"
    // разобраться почему не работает "?expand=products" так как нужно
    // скрыть из customerInfo и products ненужные поля
    this.fetch = function (req, res, next) {
        query = req.query.filter;
        paginate = req.query.count;
        page = req.query.page;

        if (query) {
            filter = {status: query}
        } else {
            filter = {}
        }

        /* var dbQuery;
         var query = req.query;
         var aggregateObject = [];
         var expandBy;
         var expand;
         var i;

         expand = query.expand;

         if (expand) {

         if (!(expand instanceof Array)) {
         expand = [expand];
         }

         for (i = 0; i < expand.length; i++) {
         expandBy = expand[i];

         console.log(expandBy);

         if (expandBy === 'products') {
         aggregateObject.push({
         $unwind: {
         path: '$products',
         preserveNullAndEmptyArrays: true
         }
         }, {
         $lookup: {
         from: 'products',
         localField: 'products',
         foreignField: '_id',
         as: 'products'
         }
         }, {
         $project: {
         itemsQuantity: 1,
         comment: 1,
         products: {$arrayElemAt: ['$products', 0]},
         status: 1
         }
         });
         }
         if (expandBy === 'customerInfo') {
         aggregateObject.push({
         $unwind: {
         path: '$customerInfo',
         preserveNullAndEmptyArrays: true

         }
         }, {
         $lookup: {
         from: 'users',
         localField: 'customerInfo',
         foreignField: '_id',
         as: 'users'
         }
         }, {
         $project: {
         itemsQuantity: 1,
         comment: 1,
         customerInfo: {$arrayElemAt: ['$users', 0]},
         status: 1
         }
         });
         }
         }

         aggregateObject.push({
         $project: {
         _id: '$_id',
         itemsQuantity: '$itemsQuantity',
         comment: '$comment',
         status: '$status',
         totalPrice: '$totalPrice',
         customerInfo: '$customerInfo',
         products: '$products'
         }
         });

         dbQuery = Order.aggregate(aggregateObject);

         } else {
         dbQuery = Order.aggregate(
         {
         $project: {
         totalPrice: 1,
         status: 1,
         created: 1,
         customerInfo: 1,
         products: 1
         }
         }
         )
         }
         dbQuery
         .limit(20)
         .exec(function (err, orders) {
         if (err) {
         return next(err);
         }

         res.status(200).send(orders);
         });*/
        Order.find(filter, {__v: 0})
            .populate({
                path  : 'products',
                select: 'name price image'
            })
            .populate({
                path  : 'customerInfo',
                select: 'firstName lastName email phone address avatar'
            })
            .skip((page - 1) * paginate)
            .limit(paginate)
            .exec(function (err, orders) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(orders);
            })
    };

    this.fetchById = function (req, res, next) {
        id = req.params.id;

        Order
            .findById(id, {
                __v    : 0,
                created: 0
            })
            .populate({
                path  : 'products',
                select: 'name price image'
            })
            .populate({
                path  : 'customerInfo',
                select: 'firstName lastName email phone address avatar'
            })
            .exec(function (err, orders) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(orders);
            })
    };

    this.createOrder = function (req, res, next) {
        itemsQuantity = req.body.itemsQuantity;
        products = req.body.products;
        customerInfo = req.body.customerInfo;

        if ((!((products) instanceof Array)) && (!((itemsQuantity) instanceof Array))) {
            products = (products).split(',');
            itemsQuantity = (itemsQuantity).split(',')
        }

        order = new Order();
        order.set({
                products     : products,
                itemsQuantity: itemsQuantity,
                customerInfo : customerInfo
            })
            .save(function (err, orders) {
                    if (err) {

                        return next(err);
                    }

                    req.params.id = orders._id;
                    next();
                }
            )
    };

    this.totalPrice = function (req, res, next) {
        id = req.params.id;
        total = 0;

        Order.findById(id)
            .populate('products', 'price')
            .exec(function (err, orders) {

                if (err) {
                    return next(err);
                }

                for (var i = 0; i < (orders.itemsQuantity.length); i++) {
                    total += (orders.itemsQuantity[i]) * (orders.products[i].price);
                }

                req.params.id = orders._id;
                req.body.totalPrice = total.toFixed(2);
                next();
            })
    };

    this.updateOrder = function (req, res, next) {
        body = req.body;
        id = req.params.id;
        totalPrice = req.body.totalPrice;

        if ((typeof id) != String) {
            id = id.toString();
        }

        if (totalPrice) {
            Order
                .findByIdAndUpdate(id, {$set: {totalPrice: totalPrice}})
                .exec(function (err, orders) {
                    if (err) {

                        return next(err);
                    }

                    req.params.id = orders.customerInfo;
                    req.body.orders = orders._id;
                    next();
                })
        } else {
            Order
                .findByIdAndUpdate(id, {$set: body})
                .exec(function (err, orders) {
                    if (err) {

                        return next(err);
                    }

                    res.status(200).send(orders);
                })
        }
    };

    this.deleteById = function (req, res, next) {
        id = req.params.id;

        Order
            .findByIdAndRemove(id)
            .exec(function (err, orders) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(orders);
            })
    };
}
;

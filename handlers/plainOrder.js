var validator = require('validator');
var fs = require("fs");
var HttpError = require('./customError').HttpError;
var PlainOrder = require('../models/plainOrder');
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

        PlainOrder.find({_id: id}, function (err, orders) {
            if (err) {
                next(err);
            }
            next();
        });
    };

    this.countModels = function (req, res, next) {
        if (query) {
            if(query=='All'){
                filter={};
            }else{
                filter = {status: query};
            }
        } else {
            filter = {};
        }

        PlainOrder.count(filter, function (err, count) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: count});
        })
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
            if(query=='All'){
                filter={};
            }else{
                filter = {status: query};
            }
        } else {
            filter = {};
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
        PlainOrder.find(filter, {__v: 0})
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

        PlainOrder
            .findById(id, {
                __v: 0
            })
            .exec(function (err, orders) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(orders);
            })
    };

    this.createOrder = function (req, res, next) {
        var id = req.body.orders;
        var order;
        var plainOrder;

        plainOrder = new PlainOrder();
        order = Order.findById(id, {
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

                plainOrder.set({
                        products     : orders.products,
                        itemsQuantity: orders.itemsQuantity,
                        totalPrice   : orders.totalPrice,
                        customerInfo : orders.customerInfo
                    }).save(function (err, orders) {
                            if (err) {

                                return next(err);
                            }

                            Order
                                .findByIdAndRemove(id)
                                .exec(function (err, orders) {
                                    if (err) {

                                        return next(err);
                                    }
                                    console.log('removed ' + orders._id);
                                });

                            req.params.id = req.body.customerInfo;
                            req.body.orders = orders._id;
                            next();
                        }
                    )
            });

    };


    this.updateOrder = function (req, res, next) {
        var comment;
        var status;
        var id;
        id=req.params.id;
        comment=req.body.comment;
        status=req.body.status;
        console.log(req.params.id, req.body);

        PlainOrder
            .findByIdAndUpdate(id,{comment: comment, status: status})
            .exec(function (err, orders) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(orders);
            })

    };

    this.deleteById = function (req, res, next) {
        id = req.params.id;

        PlainOrder
            .findByIdAndRemove(id)
            .exec(function (err, orders) {
                if (err) {

                    return next(err);
                }

                res.status(200).send(orders);
            })
    };
};

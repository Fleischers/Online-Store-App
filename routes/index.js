var logger = require('morgan');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');

module.exports = function (app) {
    var userRouter = require('./user');
    var categoryRouter = require('./category');
    var productRouter = require('./product');
    var orderRouter = require('./order');
    var productReviewRouter = require('./productReview');
    var ErrorHandler = require('../handlers/error');
    var UserHandler = require('../handlers/user');
    var handler;
    var eHandler;

    handler = new UserHandler();
    eHandler = new ErrorHandler();

    /*app.get('/', function (req, res, next) {
     *res.sendfile('../index.html');
     *});*/

    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.get('/isAuth', handler.isAuth);
    app.get('/isAuthAdmin', handler.isAuthAdmin);
    app.use('/users', userRouter);
    app.use('/categories', categoryRouter);
    app.use('/products', productRouter);
    app.use('/orders', orderRouter);
    app.use('/productReviews', productReviewRouter);
    app.use(eHandler.error);
};

var express = require('express');
var router = express.Router();
var OrderHandler = require('../handlers/order');
var PlainOrderHandler = require('../handlers/plainOrder');
var UserHandler = require('../handlers/user');
var userHandler = new UserHandler();
var handler = new OrderHandler();
var plainOrderHandler=new PlainOrderHandler();

/*router.get('/', handler.fetch);*/
router.get('/count', handler.countModels);
router.param('id', handler.validateData);
router.post('/', handler.createOrder, handler.totalPrice, handler.updateOrder, plainOrderHandler.createOrder, userHandler.updateUser);
/*router.get('/:id', handler.fetchById);*/
router.patch('/:id', handler.updateOrder);
router.put('/:id', handler.updateOrder);

module.exports = router;


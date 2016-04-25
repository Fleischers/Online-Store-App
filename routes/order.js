var express = require('express');
var router = express.Router();
var OrderHandler = require('../handlers/order');
var UserHandler = require('../handlers/user');
var userHandler = new UserHandler();
var handler = new OrderHandler();

router.get('/', handler.fetch);
router.param('id', handler.validateData);
router.post('/', handler.createOrder, handler.totalPrice, handler.updateOrder, userHandler.updateUser);
router.get('/:id', handler.fetchById);
router.patch('/:id', handler.updateOrder);
router.put('/:id', handler.updateOrder);
router.delete('/:id', handler.deleteById);

module.exports = router;


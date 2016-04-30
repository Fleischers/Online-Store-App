var express = require('express');
var router = express.Router();
var PlainOrderHandler = require('../handlers/plainOrder');
var handler = new PlainOrderHandler();

router.get('/', handler.fetch);
router.get('/count', handler.countModels);
router.param('id', handler.validateData);
router.get('/:id', handler.fetchById);
router.patch('/:id', handler.updateOrder);
router.post('/', handler.createOrder);

router.delete('/:id', handler.deleteById);

module.exports = router;
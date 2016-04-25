var express = require('express');
var router = express.Router();
var ProductHandler = require('../handlers/product');
var handler = new ProductHandler();

router.get('/', handler.fetch);
router.param('id', handler.validateData);
router.post('/', handler.createProduct);
router.get('/:id', handler.fetchById);
router.patch('/:id', handler.updateProduct);
router.post('/:id', handler.saveImage, handler.updateProduct);
router.delete('/:id', handler.deleteById);

module.exports = router;


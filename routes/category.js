var express = require('express');
var router = express.Router();
var CategoryHandler = require('../handlers/category');
var ProductHandler = require('../handlers/product');
var productHandler = new ProductHandler();
var handler = new CategoryHandler();

router.get('/', handler.fetch);
router.get('/count', handler.countModels);
router.param('id', handler.validateData);
router.post('/', handler.createCategory);
router.get('/:id', handler.fetchById);
router.patch('/:id', handler.updateCategory, productHandler.updateProduct);
router.post('/:id', handler.saveImage, handler.updateCategory, productHandler.updateProduct);
router.delete('/:id', handler.deleteById);

module.exports = router;


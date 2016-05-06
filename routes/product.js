var express = require('express');
var router = express.Router();
var CategoryHandler = require('../handlers/category');
var ProductHandler = require('../handlers/product');
var categoryHandler=new CategoryHandler();
var handler = new ProductHandler();

router.get('/', handler.fetch);
router.get('/count', handler.countModels);
router.patch('/removeCategory/:id', handler.removeCategory, categoryHandler.removeProduct);
router.param('id', handler.validateData);
router.post('/', handler.createProduct);
router.get('/:id', handler.fetchById);
router.patch('/:id', handler.updateProduct, categoryHandler.updateCategory);
router.post('/:id', handler.saveImage, handler.updateProduct);
router.delete('/:id', handler.deleteById);

module.exports = router;


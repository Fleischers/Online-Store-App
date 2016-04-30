var express = require('express');
var router = express.Router();
var ProductReviewHandler = require('../handlers/productReview');
var UserHandler = require('../handlers/user');
var ProductHandler = require('../handlers/product');
var userHandler = new UserHandler();
var productHandler = new ProductHandler();
var handler = new ProductReviewHandler();

router.get('/', handler.fetch);
router.get('/count', handler.countModels);
router.param('id', handler.validateData);
router.post('/', handler.createProductReview,userHandler.updateUser, productHandler.updateProduct);
router.get('/:id', handler.fetchById);
router.put('/:id', handler.updateProductReview);
router.delete('/:id', handler.deleteById);

module.exports = router;


var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');
var handler = new UserHandler();
var ReviewHandler = require('../handlers/productReview');
var reviewHandler = new ReviewHandler();

router.get('/count', handler.countModels);
router.post('/sendsms', handler.sendSms);
router.post('/forgotPass', handler.forgotPass);
router.get('/resetPass/:token', handler.confirmLink);
router.post('/resetPass/:token', handler.resetPass);
router.post('/login', handler.logIn);
router.post('/adminlogin', handler.isAdmin);
router.get('/verify', handler.verifyEmail);
router.post('/admin', handler.isAdmin);
router.get('/', handler.fetch);
router.post('/', handler.createUser, handler.sendEmail);
router.param('id', handler.validateData);
router.get('/:id', handler.fetchById);
router.patch('/:id', handler.updateUser);
router.post('/:id', handler.saveImage, handler.updateUser);
router.delete('/:id', handler.deleteById, reviewHandler.deleteById);
router.patch('/logout/:id', handler.logOut);

module.exports = router;


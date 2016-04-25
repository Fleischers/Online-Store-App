var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');
var handler = new UserHandler();

router.post('/sendsms', handler.sendSms);
router.post('/login', handler.logIn);
router.post('/adminlogin', handler.isAdmin);
router.post('/forgotPass', handler.forgotPass);
router.post('/resetPass', handler.resetPass);
router.get('/verify', handler.verifyEmail);
router.post('/admin', handler.isAdmin);
router.get('/', handler.fetch);
router.post('/', handler.createUser, handler.sendEmail);
router.param('id', handler.validateData);
router.get('/:id', handler.fetchById);
router.patch('/:id', handler.updateUser);
router.post('/:id', handler.saveImage, handler.updateUser);
router.delete('/:id', handler.deleteById);
router.patch('/logout/:id', handler.logOut);

module.exports = router;


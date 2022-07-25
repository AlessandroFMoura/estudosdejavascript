// const express = require('express');
// const router = express.Router();
const router = require('express').Router();

const UserController = require('../controllers/UserController');

//middleware
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');
const validationUser = require('../helpers/validation-user');

router.post('/register', validationUser, UserController.register);
router.post('/login', UserController.login);
router.get('/checkuser', UserController.checkUser);
router.get('/:id', UserController.getUserById);
router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserController.editUser);

module.exports = router;

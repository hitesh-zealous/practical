'use strict';

let express = require('express');
let router = express.Router();
let UserController = require('../controllers/user.controller');
let UserValidator = require('../validation/user.validation');
let Authentication = require('../helpers/auth.helper');

const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })

router.get('/', Authentication.ensure, UserController.list);
router.post('/create', UserValidator.validate('createUser'), UserController.create);
router.get('/:id', UserValidator.validate('userDetail'), Authentication.ensure, UserController.detail);
router.patch('/:id', UserValidator.validate('updateUser'), Authentication.ensure, UserController.update);
router.delete('/:id', UserValidator.validate('deleteUser'), Authentication.ensure, UserController.delete);
router.post('/uploadimage', upload.single('image') ,Authentication.ensure, UserController.uploadimage);
router.post('/login', UserValidator.validate('loginUser'), UserController.login);

module.exports = router;
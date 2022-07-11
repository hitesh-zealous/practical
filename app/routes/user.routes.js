'use strict';

let express = require('express');
let router = express.Router();
let UserController = require('../controllers/user.controller');
let UserValidator = require('../validation/user.validation');
let Authentication = require('../helpers/auth.helper');

router.get('/', Authentication.ensure, UserController.list);
router.post('/create', UserValidator.validate('createUser'), UserController.create);
// router.post('/login', UserValidator.validate('loginUser'), UserController.login);

module.exports = router;
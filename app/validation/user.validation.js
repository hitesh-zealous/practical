'use strict';

const { body } = require('express-validator/check')

exports.validate = (method) => {
  switch (method) {

    case 'createUser': {
      return [
        body('email', 'Invalid email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required.'),
        body('role').isIn(['admin', 'user']).withMessage('Only admin & user role accepted.'),
      ]
    }

    case 'loginUser': {
      return [
        body('email', 'Invalid email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required.'),
      ]
    }

  }
}
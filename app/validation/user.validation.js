'use strict';

const { body, param } = require('express-validator/check')

exports.validate = (method) => {
  switch (method) {

    case 'createUser': {
      return [
        body('email', 'Invalid email').isEmail().normalizeEmail(),
        body('name').isLength({ min: 3 }, { min: 150 }).trim().escape().withMessage('Name is required filed.'),
        body('contact').isLength({ min: 3 }, { min: 150 }).trim().escape().withMessage('Contact is required filed.'),
        body('password').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required.'),
        body('role').isIn(['admin', 'user']).withMessage('Only admin & user role accepted.'),
      ]
    }

    case 'userDetail': {
      return [
        param('id').trim().escape(),
      ]
    }

    case 'updateUser': {
      return [
        param('id').trim().escape(),
        body('email', 'Invalid email').isEmail().normalizeEmail(),
        body('name').isLength({ min: 3 }, { min: 150 }).trim().escape().withMessage('Name is required filed.'),
        body('contact').isLength({ min: 3 }, { min: 150 }).trim().escape().withMessage('Contact is required filed.'),
      ]
    }

    case 'deleteUser': {
      return [
        param('id').trim().escape(),
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
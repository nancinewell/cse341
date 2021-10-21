"use strict";

var express = require('express');

var _require = require('express-validator'),
    check = _require.check,
    body = _require.body;

var authController = require('../controllers/auth');

var User = require('../models/user');

var router = express.Router();
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', [check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail().trim().custom(function (value, _ref) {
  var req = _ref.req;
  return User.findOne({
    email: value
  }).then(function (userDoc) {
    if (!userDoc) {
      return Promise.reject('Email does not exist. Please sign up.');
    }
  })["catch"](function (err) {//return Promise.reject('Email does not exist. Please sign up.');
  });
}), body('password', "This is the default error message for all of these validators").isLength({
  min: 8
}).isAlphanumeric() //don't really restrict passwords to alphanumeric!
], authController.postLogin);
router.post('/signup', [body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail().trim().custom(function (value, _ref2) {
  var req = _ref2.req;
  // if(value === 'test@test.com'){
  //     throw new Error('This email address is forbidden.');
  // }
  // return true;
  return User.findOne({
    email: value
  }).then(function (userDoc) {
    if (userDoc) {
      return Promise.reject('Email already exists. Please log in.');
    }
  })["catch"](function (err) {
    console.log("Error auth-route 34: ".concat(err));
  });
}), body('confirmPassword').custom(function (value, _ref3) {
  var req = _ref3.req;

  if (value != req.body.password) {
    throw new Error('Passwords have to match!');
  }

  return true;
}), body('password', "This is the default error message for all of these validators").isLength({
  min: 8
}).isAlphanumeric() //don't really restrict passwords to alphanumeric!
], authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;
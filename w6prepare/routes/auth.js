const express = require('express');

const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
[
    check('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail()
    .trim()
    .custom((value, {req}) => {
        User.findOne({email: value})
        .then(userDoc => {
            if(!userDoc){
            return Promise.reject('Email does not exist. Please sign up.');
            }
        })
    .catch(err => {
        return Promise.reject('Email does not exist. Please sign up.');
    })
}),

body('password', "This is the default error message for all of these validators")
    .isLength({min: 8})
    .isAlphanumeric()//don't really restrict passwords to alphanumeric!
], 
authController.postLogin);

router.post('/signup', 
[
    check('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail()
        .trim()
    .custom((value, {req}) => {
    // if(value === 'test@test.com'){
    //     throw new Error('This email address is forbidden.');
    // }
    // return true;

    User.findOne({email: value})
    .then(userDoc => {
        if(userDoc){
          return Promise.reject('Email already exists. Please log in.');
        }
    })
    .catch(err => {
        console.log(`Error auth-route 34: ${err}`);
    })
}),
body('confirmPassword').custom((value,{req}) => {
    if(value !== req.body.password){
        throw new Error('Passwords have to match!')
    }
}),
body('password', "This is the default error message for all of these validators")
    .isLength({min: 8})
    .isAlphanumeric()//don't really restrict passwords to alphanumeric!


], 
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
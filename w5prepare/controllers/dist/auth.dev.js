"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["Message sent: ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var User = require('../models/user');

var bcrypt = require('bcryptjs');

var nodemailer = require('nodemailer');

var sendgridTransport = require('nodemailer-sendgrid-transport');

var transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = function (req, res, next) {
  var message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postLogin = function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({
    email: email
  }).then(function (user) {
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    bcrypt.compare(password, user.password).then(function (doMatch) {
      if (doMatch) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        return req.session.save(function (err) {
          console.log(err);
          res.redirect('/');
        });
      }

      req.flash('error', 'Invalid email or password');
      res.redirect('/login');
    })["catch"](function (err) {
      console.log(err);
      res.redirect('/login');
    });
  })["catch"](function (err) {
    return console.log(err);
  }); //res.setHeader('Set-Cookie', 'loggedIn = true;'); Expires=set-date; Max-Age=number-in-seconds; Secure; (page will only be served via https) HttpOnly; (cookie can't be accessed form clientside js. Malicious code can't read your cookie values) 
};

exports.postLogout = function (req, res, next) {
  req.session.destroy(function (err) {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = function (req, res, next) {
  var message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postSignup = function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword; //ensure user does not already exist
  // could make email field unique or:

  User.findOne({
    email: email
  }).then(function (userDoc) {
    if (userDoc) {
      req.flash('error', 'Email already exists. Please log in.');
      return res.redirect('/signup');
    }

    return bcrypt.hash(password, 12).then(function (hashedPassword) {
      var user = new User({
        email: email,
        password: hashedPassword,
        cart: {
          items: []
        }
      });
      return user.save();
    }).then(function (result) {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'nanci.newell@gmail.com',
        subject: 'Signup Succeeded',
        html: '<h1>You successfully signed up!</h1>'
      }, function (err, info) {
        if (err) {
          console.log("Error: ".concat(err));
        } else {
          console.log(_templateObject(), info);
        }
      });
    })["catch"](function (err) {
      console.log(err);
    });
  })["catch"](function (err) {
    console.log(err);
  });
};
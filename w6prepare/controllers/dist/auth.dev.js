"use strict";

function _templateObject2() {
  var data = _taggedTemplateLiteral(["Message sent: ", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

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

var crypto = require('crypto');

var _require = require('express-validator/check'),
    validationResult = _require.validationResult;

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
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
  });
};

exports.postLogin = function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Log In',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({
    email: email
  }).then(function (user) {
    if (!user) {
      res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Log In',
        isAuthenticated: false,
        errorMessage: "Invalid email or password",
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });
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

      res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Log In',
        isAuthenticated: false,
        errorMessage: "Invalid email or password",
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });
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
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationErrors: []
  });
};

exports.postSignup = function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12).then(function (hashedPassword) {
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
    console.log("Error: ".concat(err));
  });
};

exports.getReset = function (req, res, next) {
  var message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = function (req, res, next) {
  crypto.randomBytes(32, function (err, buffer) {
    if (err) {
      console.log("Error: ".concat(err));
      return res.redirect('reset');
    }

    var token = buffer.toString('hex');
    User.findOne({
      email: req.body.email
    }).then(function (user) {
      if (!user) {
        req.flash('error', 'No account with that email found');
        return res.redirect('/reset');
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 360000;
      return user.save();
    }).then(function (result) {
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from: 'nanci.newell@gmail.com',
        subject: 'Password Reset',
        html: "<p>You requested a password reset.</p>\n                <p>Click <a href=\"http://localhost:3000/reset/".concat(token, ">this link</a> to set a new password</p>")
      }, function (err, info) {
        if (err) {
          console.log("Error line 179: ".concat(err));
        } else {
          console.log(_templateObject2(), info);
        }
      });
    })["catch"](function (err) {
      console.log("Error line 186: ".concat(err));
    });
  });
};

exports.getNewPassword = function (req, res, next) {
  var token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  }).then(function (user) {
    var message = req.flash('error');

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      passwordToken: token,
      userId: user._id.toString()
    });
  });
};

exports.postNewPassword = function (req, res, next) {
  var newPassword = req.body.password;
  var userId = req.body.userId;
  var passwordToken = req.body.passwordToken;
  var resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {
      $gt: Date.now()
    },
    _id: userId
  }).then(function (user) {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  }).then(function (hashedPassword) {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  }).then(function (result) {
    res.redirect('/login');
  })["catch"](function (err) {
    console.log("Error line 223: ".concat(err));
  });
};
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length>0){
    message = message[0];
  }else {
    message = null;
  }
  res.render('auth/login', {
        path: '/login',
        pageTitle: 'Log In',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {email: "", password: ""},
        validationErrors: []
      })
    };

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
if(!errors.isEmpty()){
  res.status(422).render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    isAuthenticated: false,
    errorMessage: errors.array()[0].msg,
    oldInput: {email: email, password: password},
    validationErrors: errors.array()
  })
}

    User.findOne({email: email})
      .then(user => {
          if(!user){
            res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Log In',
              isAuthenticated: false,
              errorMessage: "Invalid email or password",
              oldInput: {email: email, password: password},
              validationErrors: []
            })
          }
          bcrypt.compare(password, user.password)
          .then(doMatch => {
              if(doMatch){
                req.session.user = user;
                req.session.isLoggedIn = true;
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });  
              }
              res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Log In',
                isAuthenticated: false,
                errorMessage: "Invalid email or password",
                oldInput: {email: email, password: password},
                validationErrors: []
              });
          })
          .catch(err => {
              console.log(err);
              res.redirect('/login');
          });

        
        
      })
      .catch(err => console.log(err));
    
    //res.setHeader('Set-Cookie', 'loggedIn = true;'); Expires=set-date; Max-Age=number-in-seconds; Secure; (page will only be served via https) HttpOnly; (cookie can't be accessed form clientside js. Malicious code can't read your cookie values) 
    
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/'); 
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length>0){
    message = message[0];
  }else {
    message = null;
  }  
  res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: message,
      oldInput: {email: "", password: "", confirmPassword: ""},
      validationErrors: []
    });
  };

  exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log(errors.array());
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {email: email, password: password, confirmPassword: confirmPassword},
        validationErrors: errors.array()
      });
    }
    
        bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {items: []}
            });
            return user.save();
        })
        .then(result => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 'nanci.newell@gmail.com',
            subject: 'Signup Succeeded',
            html: '<h1>You successfully signed up!</h1>'
          }, function(err, info){
            if(err){
              console.log(`Error: ${err}`);
            } else {
              console.log`Message sent: ${info}`;
            }
          });
        })
        .catch(err => {
          console.log(`Error: ${err}`);
      });
    }



  exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      errorMessage: message
    })
  }


  exports.postReset = (req, res, next)=>{
    crypto.randomBytes(32, (err, buffer) => {
      if(err){
        console.log(`Error: ${err}`);
        return res.redirect('reset');
      }
      const token = buffer.toString('hex');

      User.findOne({email: req.body.email})
      .then(user => {
        if(!user){
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'nanci.newell@gmail.com',
          subject: 'Password Reset',
          html: `<p>You requested a password reset.</p>
                <p>Click <a href="http://localhost:3000/reset/${token}>this link</a> to set a new password</p>`
        }, function(err, info){
          if(err){
            console.log(`Error line 179: ${err}`);
          } else {
            console.log`Message sent: ${info}`;
          }
        });
      })
      .catch(err => {
        console.log(`Error line 186: ${err}`);
      })

    })
  }


  exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user =>{
      let message = req.flash('error');
      if(message.length > 0){
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
      })
    })
    
  }


  exports.postNewPassword = (req, res, next) =>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId})
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(`Error line 223: ${err}`);
    })
  }
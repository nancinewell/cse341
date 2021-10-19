const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

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
        errorMessage: message
      })
    };

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
      .then(user => {
          if(!user){
            req.flash('error', 'Invalid email or password');
              return res.redirect('/login');
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
              req.flash('error', 'Invalid email or password');
              res.redirect('/login');
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
      errorMessage: message
    });
  };

  exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    //ensure user does not already exist
    // could make email field unique or:
    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc){
          req.flash('error', 'Email already exists. Please log in.');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12).then(hashedPassword => {
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
          console.log(err);
      });
    })
    .catch(err => {
        console.log(err);
    });

  };
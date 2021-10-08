"use strict";

var path = require('path');

var mongoose = require('mongoose');

var express = require('express');

var bodyParser = require('body-parser');

var errorController = require('./controllers/error');

var User = require('./models/user');

var app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

var adminRoutes = require('./routes/admin');

var shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  User.findById("615c4e27045748fae3cc7093").then(function (user) {
    req.user = user;
    next();
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
mongoose.connect('mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/shop?retryWrites=true&w=majority').then(function (result) {
  User.findOne().then(function (user) {
    if (!user) {
      var _user = new User({
        name: 'AdminUser',
        email: 'admin@email.com',
        cart: {
          items: []
        }
      });

      _user.save();
    }
  });
  app.listen(3000);
})["catch"](function (err) {
  console.log("Error: ".concat(err));
});
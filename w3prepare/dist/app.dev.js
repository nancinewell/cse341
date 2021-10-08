"use strict";

var path = require('path');

var express = require('express');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var errorController = require('./controllers/error');

var mongoConnect = require('./util/database').mongoConnect;

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
  User.findById("615b67ef8853cbdf75f025cc").then(function (user) {
    req.user = new User(user.name, user.email, user.cart, user._id); //console.log(`app.use User.findById() USER ID: ${req.user._id}`);

    next();
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
mongoConnect(function () {
  app.listen(3000);
});
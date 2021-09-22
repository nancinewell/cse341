"use strict";

var http = require('http');

var path = require('path');

var bodyParser = require('body-parser');

var express = require('express');

var expressHbs = require('express-handlebars');

var app = express();
app.engine('hbs', expressHbs);
app.set('view engine', 'hbs'); //app.set('view engine', 'pug');

app.set('views', 'views'); //views is actually the default. Be sure to set this if you use another folder. 

var adminData = require('./routes/admin');

var shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(adminData.routes);
app.use(shopRoutes);
app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: '404: Page Not Found'
  });
});
app.listen(3000);
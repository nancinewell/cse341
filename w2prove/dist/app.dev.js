"use strict";

var path = require('path');

var bodyParser = require('body-parser');

var express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));

var adminRoutes = require('./routes/admin');

var bookRoutes = require('./routes/books');

app.use(express["static"](path.join(__dirname, 'public')));
app.use(adminRoutes.routes);
app.use(bookRoutes); //If page not found

app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: '404: Page Not Found'
  });
});
app.listen(3000);
"use strict";

var http = require('http');

var path = require('path');

var bodyParser = require('body-parser');

var express = require('express');

var app = express();

var adminData = require('./routes/admin');

var shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(adminData.routes);
app.use(shopRoutes);
app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
app.listen(3000);
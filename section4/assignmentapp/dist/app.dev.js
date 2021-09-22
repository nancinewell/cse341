"use strict";

var path = require('path');

var bodyParser = require('body-parser');

var express = require('express');

var adminRoutes = require('./routes/admin');

var moreRoutes = require('./routes/anotherpage');

var app = express(); //MIDDLEWARE
//parse incoming req body

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(adminRoutes);
app.use(moreRoutes);
app.use(function (req, res, next) {
  res.status(404).sendFile(pathway.join(__dirname, 'views', '404.html'));
});
app.listen(3000);
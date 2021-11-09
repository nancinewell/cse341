"use strict";

var express = require('express');

var feedRoutes = require('./routes/feed');

var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); //to allow other sites to access the data

app.use(function (req, res, next) {
  res.setHeader('Access-Controll-Allow-Origin', '*');
  res.setHeader('Access-Controll-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/feed', feedRoutes);
app.listen(8080);
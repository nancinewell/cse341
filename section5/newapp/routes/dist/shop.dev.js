"use strict";

var path = require('path');

var express = require('express');

var rootDir = require('../util/path');

var router = express.Router();

var adminData = require('./admin');

router.get('/', function (req, res, next) {
  var products = adminData.products;
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true
  });
});
module.exports = router;
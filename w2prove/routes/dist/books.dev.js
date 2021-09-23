"use strict";

var express = require('express');

var router = express.Router();

var adminRoutes = require('./admin');

router.get('/', function (req, res, next) {
  var books = adminRoutes.books;
  res.render('library', {
    books: books,
    pageTitle: 'Library',
    path: '/',
    activeBookPage: true
  });
});
module.exports = router;
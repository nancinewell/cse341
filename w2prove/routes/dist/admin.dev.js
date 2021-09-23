"use strict";

var express = require('express');

var router = express.Router();

var adminRoutes = require('./admin');

var serialNo = 0;
var books = []; //Add-book GET

router.get('/add-book', function (req, res, next) {
  res.render('add-book', {
    pageTitle: 'Add Book',
    path: '/add-book',
    activeAddBook: true
  });
}); //Add-Book POST

router.post('/add-book', function (req, res, next) {
  books.push({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    serial: serialNo
  });
  serialNo++;
  res.redirect('/');
}); //Nix-Book POST

router.post('/nix-book', function (req, res, next) {
  var index = books.findIndex(function (book) {
    return book.serial === parseInt(req.body.serial);
  });
  books.splice(index, 1);
  res.redirect('/');
}); //Search POST

router.post('/search', function (req, res, next) {
  var books = adminRoutes.books;
  var filteredBooks = books.filter(function (book) {
    return book.title.includes(req.body.search) || book.author.includes(req.body.search);
  });
  res.render('search-results', {
    books: filteredBooks,
    pageTitle: 'Search Results',
    path: '/search-results',
    activeBookPage: true
  });
});
exports.routes = router;
exports.books = books;
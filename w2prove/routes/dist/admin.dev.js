"use strict";

var express = require('express');

var router = express.Router();
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
    description: req.body.desc,
    image: req.body.image
  });
  res.redirect('/');
}); //Nix-Book POST

router.post('/nix-book', function (req, res, next) {
  var index = books.indexOf(req.body.title);
  books.splice(index, 1);
  res.redirect('/');
});
exports.routes = router;
exports.books = books;
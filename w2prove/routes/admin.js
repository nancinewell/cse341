const express = require('express');
const router = express.Router();

const books = [];

//Add-book GET
router.get('/add-book', (req, res, next) => {
    res.render('add-book', {
        pageTitle: 'Add Book',
        path: '/add-book', 
        activeAddBook: true
    });
});

//Add-Book POST
router.post('/add-book', (req, res, next) => {
    books.push({title: req.body.title, author: req.body.author, price: req.body.price, description: req.body.desc, image: req.body.image});
    res.redirect('/');
});

//Nix-Book POST
router.post('/nix-book', (req, res, next) => {
    let index = books.indexOf(req.body.title);
    books.splice(index, 1);
    res.redirect('/');
})

exports.routes = router;
exports.books = books;
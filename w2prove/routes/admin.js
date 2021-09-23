const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
let serialNo = 0;
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
    books.push({title: req.body.title, author: req.body.author, price: req.body.price, description: req.body.description, image: req.body.image, serial: serialNo});
    serialNo++;
    res.redirect('/');
});

//Nix-Book POST
router.post('/nix-book', (req, res, next) => {
    let index = books.findIndex(book => book.serial === parseInt(req.body.serial));
    books.splice(index, 1);
    res.redirect('/');
})

//Search POST
router.post('/search', (req, res, next) => {
    const books = adminRoutes.books;
    let filteredBooks = books.filter(book => book.title.includes(req.body.search) || book.author.includes(req.body.search));
    res.render('search-results', {
        books: filteredBooks,
        pageTitle: 'Search Results',
        path: '/search-results',
        activeBookPage: true
    });
});

exports.routes = router;
exports.books = books;
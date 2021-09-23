const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');

router.get('/', (req, res, next) => {
    const books = adminRoutes.books;
    res.render('library', {
        books: books,
        pageTitle: 'Library',
        path: '/',
        activeBookPage: true
    });
});

module.exports = router;
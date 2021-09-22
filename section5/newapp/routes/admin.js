const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

//Add Product - GET
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

//Add Product - POST
router.post('/add-product', (req, res, next) => { 
    products.push({title: req.body.title});
    res.redirect('/');
});


exports.routes = router;
exports.products = products;
const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    //console.log('/add-product response');
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => { //app.get will only fire for get requests  app.post will filter for incoming post
    //console.log('/product response');
    console.log(req.body); //doesn't parse the body! Need the Body-Parser. 
    //console log shows [Object: null prototype] { title: 'Book' } instead of just the object { title: 'Book' }
    res.redirect('/');
});


module.exports = router;

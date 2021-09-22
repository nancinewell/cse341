const pathway = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');

router.get('/add-thing', (req, res, next) => {
    res.sendFile(pathway.join(rootDir, 'views', 'add-thing.html'));
});

router.post('/add-thing', (req, res, next) => { 
    console.log(req.body); 
    res.redirect('/');
});


module.exports = router;

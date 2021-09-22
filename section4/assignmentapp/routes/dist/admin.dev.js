"use strict";

var pathway = require('path');

var express = require('express');

var router = express.Router();

var rootDir = require('../util/path');

router.get('/add-thing', function (req, res, next) {
  res.sendFile(pathway.join(rootDir, 'views', 'add-thing.html'));
});
router.post('/add-thing', function (req, res, next) {
  console.log(req.body);
  res.redirect('/');
});
module.exports = router;
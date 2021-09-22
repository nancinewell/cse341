"use strict";

var path = require('path');

var express = require('express');

var rootDir = require('../util/path');

var router = express.Router();
router.get('/', function (req, res, next) {
  //console.log('/any response');
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});
module.exports = router;
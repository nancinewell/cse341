"use strict";

var pathway = require('path');

var express = require('express');

var router = express.Router();

var rootDir = require('../util/path');

router.get('/', function (req, res, next) {
  res.sendFile(pathway.join(rootDir, 'views', 'anotherpage.html'));
});
module.exports = router;
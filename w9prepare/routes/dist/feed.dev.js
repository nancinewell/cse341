"use strict";

var express = require('express');

var router = express.Router();

var feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);
router.post('/post', feedController.postPosts);
module.exports = router;
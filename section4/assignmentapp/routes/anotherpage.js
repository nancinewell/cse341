const pathway = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');

router.get('/', (req, res, next) => {    
    res.sendFile(pathway.join(rootDir, 'views', 'anotherpage.html'));
});
module.exports = router;
"use strict";

var path = require('path');

var express = require('express');

var _require = require('express-validator'),
    check = _require.check,
    body = _require.body;

var adminController = require('../controllers/admin');

var isAuth = require('../middleware/is-auth');

var router = express.Router(); // /admin/add-product => GET

router.get('/add-product', isAuth, adminController.getAddProduct); // /admin/products => GET

router.get('/products', isAuth, adminController.getProducts); // /admin/add-product => POST

router.post('/add-product', [body('title').trim(), body('imageUrl').isURL(), body('price').isFloat(), body('description').isLength({
  min: 5,
  max: 400
}).trim()], isAuth, adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', [body('title').isAlphanumeric().trim(), body('imageUrl').isURL(), body('price').isFloat(), body('description').isLength({
  min: 5,
  max: 400
}).trim()], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
module.exports = router;
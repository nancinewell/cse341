"use strict";

var path = require('path');

var express = require('express');

var shopController = require('../controllers/shop');

var router = express.Router();
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);
module.exports = router;
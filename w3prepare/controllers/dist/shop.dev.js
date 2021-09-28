"use strict";

var Product = require('../models/product');

var Cart = require('../models/cart');

exports.getProducts = function (req, res, next) {
  Product.fetchAll(function (products) {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = function (req, res, next) {
  var prodId = req.params.productId;
  console.log("in controller-getProduct- prodId: " + prodId);
  Product.findById(prodId, function (product) {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = function (req, res, next) {
  Product.fetchAll(function (products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = function (req, res, next) {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};

exports.postCart = function (req, res, next) {
  var prodId = req.body.productId;
  console.log("shop.js controller  exports.postCart prodId: " + prodId);
  Product.findById(prodId, function (product) {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.getOrders = function (req, res, next) {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = function (req, res, next) {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
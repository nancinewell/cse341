"use strict";

var Product = require('../models/product'); // * * * * * * * GET PRODUCTS * * * * * * * 


exports.getProducts = function (req, res, next) {
  Product.fetchAll(function (products) {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
}; // * * * * * * * GET INDEX * * * * * * * 


exports.getIndex = function (req, res, next) {
  Product.fetchAll(function (products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
}; // * * * * * * * GET CART * * * * * * * 


exports.getCart = function (req, res, next) {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
}; // * * * * * * * GET ORDERS * * * * * * * 


exports.getOrders = function (req, res, next) {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
}; // * * * * * * * GET CHECKOUT * * * * * * * 


exports.getCheckout = function (req, res, next) {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
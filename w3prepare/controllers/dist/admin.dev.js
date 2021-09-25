"use strict";

var Product = require('../models/product'); // * * * * * * * ADD PRODUCT - GET* * * * * * * 


exports.getAddProduct = function (req, res, next) {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
}; // * * * * * * * ADD PRODUCT - POST* * * * * * * 


exports.postAddProduct = function (req, res, next) {
  var product = new Product(req.body.title);
  product.save();
  res.redirect('/');
}; // * * * * * * * GET PRODUCTS * * * * * * * 


exports.getProducts = function (req, res, next) {
  Product.fetchAll(function (products) {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
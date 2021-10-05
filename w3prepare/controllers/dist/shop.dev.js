"use strict";

var Product = require('../models/product');

var User = require('../models/user');

exports.getIndex = function (req, res, next) {
  Product.fetchAll().then(function (products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })["catch"](function (err) {
    console.log("Error: ".concat(err));
  });
};

exports.getProducts = function (req, res, next) {
  Product.fetchAll().then(function (products) {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })["catch"](function (err) {
    console.log("Error: ".concat(err));
  });
};

exports.getProduct = function (req, res, next) {
  var prodId = req.params.productId;
  Product.findById(prodId).then(function (product) {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
};

exports.getCart = function (req, res, next) {
  req.user.getCart().then(function (products) {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
};

exports.postCart = function (req, res, next) {
  var prodId = req.body.productId;
  Product.findById(prodId).then(function (product) {
    return req.user.addToCart(product);
  }).then(function (result) {
    console.log("Result postCart: ".concat(result));
    res.redirect('/cart');
  });
};

exports.postCartDeleteProduct = function (req, res, next) {
  var prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId).then(function (result) {
    res.redirect('/cart');
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
};

exports.postOrder = function (req, res, next) {
  var fetchedCart;
  req.user.addOrder().then(function (result) {
    res.redirect('/orders');
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
};

exports.getOrders = function (req, res, next) {
  req.user.getOrders().then(function (orders) {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}; // exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
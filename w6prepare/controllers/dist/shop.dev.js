"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Product = require('../models/product');

var Order = require('../models/orders');

var ITEMS_PER_PAGE = 2;

exports.getProducts = function (req, res, next) {
  var page = +req.query.page;

  if (!page) {
    page = 1;
  }

  var totalItems;
  Product.find().countDocuments().then(function (numProducts) {
    totalItems = numProducts;
    return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
  }).then(function (products) {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.getProduct = function (req, res, next) {
  var prodId = req.params.productId;
  Product.findById(prodId).then(function (product) {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.getIndex = function (req, res, next) {
  var page = +req.query.page;

  if (!page) {
    page = 1;
  }

  var totalItems;
  console.log(page);
  Product.find().countDocuments().then(function (numProducts) {
    totalItems = numProducts;
    return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
  }).then(function (products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.getCart = function (req, res, next) {
  req.user.populate('cart.items.productId').execPopulate().then(function (user) {
    var products = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
      isAuthenticated: req.session.isLoggedIn
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.postCart = function (req, res, next) {
  var prodId = req.body.productId;
  Product.findById(prodId).then(function (product) {
    return req.user.addToCart(product);
  }).then(function (result) {
    console.log(result);
    res.redirect('/cart');
  });
};

exports.postCartDeleteProduct = function (req, res, next) {
  var prodId = req.body.productId;
  req.user.removeFromCart(prodId).then(function (result) {
    res.redirect('/cart');
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.postOrder = function (req, res, next) {
  req.user.populate('cart.items.productId').execPopulate().then(function (user) {
    var products = user.cart.items.map(function (i) {
      return {
        quantity: i.quantity,
        product: _objectSpread({}, i.productId._doc)
      };
    });
    var order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products
    });
    return order.save();
  }).then(function (result) {
    return req.user.clearCart();
  }).then(function () {
    res.redirect('/orders');
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.getOrders = function (req, res, next) {
  Order.find({
    'user.userId': req.user._id
  }).then(function (orders) {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};
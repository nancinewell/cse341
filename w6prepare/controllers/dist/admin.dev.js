"use strict";

var Product = require('../models/product');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

exports.getAddProduct = function (req, res, next) {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    hasError: false,
    errorMessage: null //or isAuthenticated: req.session.user;

  });
};

exports.postAddProduct = function (req, res, next) {
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  var price = req.body.price;
  var description = req.body.description;
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      isAuthenticated: req.session.isLoggedIn,
      hasError: true,
      errorMessage: errors.array()[0].msg
    });
  }

  var product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product.save().then(function (result) {
    // console.log(result);
    console.log('Created Product');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    //  //Return same view with info already input
    // return res.status(500).render('admin/edit-product', {
    //   pageTitle: 'Add Product',
    //   path: '/admin/edit-product',
    //   editing: false,
    //   product: {
    //     title: title,
    //     imageUrl: imageUrl,
    //     price: price,
    //     description: description
    //   },
    //   isAuthenticated: req.session.isLoggedIn,
    //   hasError: true,
    //   errorMessage: "Product was not added due to a database error. Please try again later.",
    //   validationErrors: []
    // });
    // //Redirect to error page
    //res.redirect('/500');
    var error = new Error('something happened...');
    error.httpStatusCode = 500;
    return next(error); //When you call next() with an error as an argument, it'll skip all other middlewares and go to an error-handling middleware.(app.js)
  });
};

exports.getEditProduct = function (req, res, next) {
  var editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  var prodId = req.params.productId;
  Product.findById(prodId).then(function (product) {
    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isAuthenticated: req.session.isLoggedIn,
      hasError: false,
      errorMessage: null
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.postEditProduct = function (req, res, next) {
  var prodId = req.body.productId;
  var updatedTitle = req.body.title;
  var updatedPrice = req.body.price;
  var updatedImageUrl = req.body.imageUrl;
  var updatedDesc = req.body.description;
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc
      },
      isAuthenticated: req.session.isLoggedIn,
      hasError: true,
      errorMessage: errors.array()[0].msg
    });
  }

  Product.findById(prodId) //only allow edits if user is the creator of the product
  .then(function (product) {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save().then(function (result) {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.getProducts = function (req, res, next) {
  //find only products created by this user
  Product.find({
    userId: req.user._id
  }) // .select('title price -_id')
  // .populate('userId', 'name')
  .then(function (products) {
    console.log(products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn,
      hasError: false,
      errorMessage: null
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.postDeleteProduct = function (req, res, next) {
  var prodId = req.body.productId;
  Product.deleteOne({
    _id: prodId,
    userId: req.user._id
  }).then(function () {
    console.log('DESTROYED PRODUCT');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    return console.log(err);
  });
};
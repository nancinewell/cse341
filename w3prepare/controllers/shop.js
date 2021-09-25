const Product = require('../models/product');

// * * * * * * * GET PRODUCTS * * * * * * * 
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        });
    });
};

// * * * * * * * GET INDEX * * * * * * * 
exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            });
        });
}

// * * * * * * * GET CART * * * * * * * 
exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart'
    });
}

// * * * * * * * GET ORDERS * * * * * * * 
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
}

// * * * * * * * GET CHECKOUT * * * * * * * 
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}
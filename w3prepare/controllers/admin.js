const Product = require('../models/product');

// * * * * * * * ADD PRODUCT - GET* * * * * * * 
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
};

// * * * * * * * ADD PRODUCT - POST* * * * * * * 
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imgURL = req.body.imgURL;
    const price = req.body.price;
    const desc = req.body.desc;
    const product = new Product(title, imgURL, price, desc);
    product.save();
    res.redirect('/');
  };

// * * * * * * * GET PRODUCTS * * * * * * * 
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            });
        });
}
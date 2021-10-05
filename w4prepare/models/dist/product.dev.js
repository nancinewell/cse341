"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mongodb = require('mongodb');

var getDb = require('../util/database').getDb;

var Product =
/*#__PURE__*/
function () {
  function Product(title, price, description, imageUrl, id, userId) {
    _classCallCheck(this, Product);

    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  _createClass(Product, [{
    key: "save",
    value: function save() {
      //connect to the db
      var db = getDb();
      var dbOp;

      if (this._id) {
        //update
        dbOp = db.collection('products').updateOne({
          _id: this._id
        }, {
          $set: this
        });
      } else {
        return dbOp = db.collection('products').insertOne(this);
      } //tell mongodb what collection to work with. if it doesn't exist, it'll be created on the fly


      return dbOp.then(function (result) {
        console.log("Result of Product.save(): ".concat(result));
      })["catch"](function (err) {
        console.log("Error: ".concat(err));
      });
    }
  }], [{
    key: "fetchAll",
    value: function fetchAll() {
      var db = getDb(); //.find({title: 'A Book Title'})   use to filter!
      //.find().toArray() to send it to an array

      return db.collection('products').find().toArray() //returns a promise
      .then(function (products) {
        //console.log(products);
        return products;
      })["catch"](function (err) {
        console.log("Error: %{err}");
      });
    }
  }, {
    key: "findById",
    value: function findById(prodId) {
      var db = getDb();
      return db.collection('products').find({
        _id: new mongodb.ObjectId(prodId)
      }) // create a new object id of MongoDB's type to compare the existing mongodb id to.
      .next().then(function (product) {
        //console.log(product);
        return product;
      })["catch"](function (err) {
        console.log("Error: %{err}");
      });
    }
  }, {
    key: "deleteById",
    value: function deleteById(prodId) {
      var db = getDb();
      return db.collection('products').deleteOne({
        _id: new mongodb.ObjectId(prodId)
      }).then(function () {
        console.log("deleted");
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }]);

  return Product;
}();

module.exports = Product;
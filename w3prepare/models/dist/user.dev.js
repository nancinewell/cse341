"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["findById- User: ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mongodb = require('mongodb');

var getDb = require('../util/database').getDb;

var ObjectId = mongodb.ObjectId;

var User =
/*#__PURE__*/
function () {
  function User(username, email, cart, id) {
    _classCallCheck(this, User);

    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  _createClass(User, [{
    key: "save",
    value: function save() {
      //connect to the db
      var db = getDb();
      return dbOp = db.collection('users').insertOne({
        _id: this._id
      }, {
        $set: this
      });
    }
  }, {
    key: "addToCart",
    value: function addToCart(product) {
      var cartProductIndex = this.cart.items.findIndex(function (cp) {
        return cp.productId.toString() === product._id.toString();
      });
      var newQuantity = 1;

      var updatedCartItems = _toConsumableArray(this.cart.items);

      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: new ObjectId(product._id),
          quantity: 1
        });
      }

      var updatedCart = {
        items: updatedCartItems
      };
      var db = getDb();
      return db.collection('users').updateOne({
        _id: new ObjectId(this._id)
      }, {
        $set: {
          cart: updatedCart
        }
      });
    }
  }, {
    key: "deleteItemFromCart",
    value: function deleteItemFromCart(productId) {
      var updatedCartItems = this.cart.items.filter(function (item) {
        return item.productId.toString() !== productId.toString();
      });
      var db = getDb();
      return db.collection('users').updateOne({
        _id: new ObjectId(this._id)
      }, {
        $set: {
          cart: {
            items: updatedCartItems
          }
        }
      });
    }
  }, {
    key: "getCart",
    value: function getCart() {
      var _this = this;

      var db = getDb();
      var productIds = this.cart.items.map(function (i) {
        return i.productId;
      });
      return db.collection('products').find({
        _id: {
          $in: productIds
        }
      }).toArray().then(function (products) {
        return products.map(function (p) {
          return _objectSpread({}, p, {
            quantity: _this.cart.items.find(function (i) {
              return i.productId.toString() === p._id.toString();
            }).quantity
          });
        });
      });
    }
  }, {
    key: "addOrder",
    value: function addOrder() {
      var _this2 = this;

      var db = getDb();
      return this.getCart().then(function (products) {
        var order = {
          items: products,
          user: {
            _id: new ObjectId(_this2.id),
            name: _this2.username
          }
        };
        return db.collection('orders').insertOne(order);
      }).then(function (resulte) {
        _this2.cart = {
          items: []
        };
        return db.collection('users').updateOne({
          _id: new ObjectId(_this2._id)
        }, {
          $set: {
            cart: {
              items: []
            }
          }
        });
      });
    }
  }, {
    key: "getOrders",
    value: function getOrders() {
      var db = getDb();
      return db.collection('orders').find({
        'user._id': new ObjectId(this._id)
      }).toArray();
    }
  }], [{
    key: "findById",
    value: function findById(userId) {
      var db = getDb();
      return db.collection('users').findOne({
        _id: new ObjectId(userId)
      }).then(function (user) {
        console.log(_templateObject(), user);
        return user;
      })["catch"](function (err) {
        console.log("Error: ".concat(err));
      });
    }
  }]);

  return User;
}();

module.exports = User;
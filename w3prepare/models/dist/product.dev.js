"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var path = require('path');

var p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

var getProductsFromFile = function getProductsFromFile(cb) {
  fs.readFile(p, function (err, fileContent) {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports =
/*#__PURE__*/
function () {
  function Product(title, imageUrl, description, price) {
    _classCallCheck(this, Product);

    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  _createClass(Product, [{
    key: "save",
    value: function save() {
      var _this = this;

      this.id = Math.random();
      console.log("this.id: " + this.id);
      getProductsFromFile(function (products) {
        products.push(_this);
        fs.writeFile(p, JSON.stringify(products), function (err) {
          console.log("Error: ".concat(err));
        });
      });
    }
  }], [{
    key: "fetchAll",
    value: function fetchAll(cb) {
      getProductsFromFile(cb);
    }
  }, {
    key: "findById",
    value: function findById(id, cb) {
      getProductsFromFile(function (products) {
        var product = products.find(function (p) {
          return parseFloat(p.id) === parseFloat(id);
        });
        console.log("in Product Model- findById - product:" + product);
        cb(product);
      });
    }
  }]);

  return Product;
}();
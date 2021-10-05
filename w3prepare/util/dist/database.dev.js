"use strict";

//mongodb user: nodeuser  password: p1ngpong
//mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var _db;

var mongoConnect = function mongoConnect(callback) {
  MongoClient.connect('mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/shop?retryWrites=true&w=majority').then(function (client) {
    console.log("Connected to MongoDB");
    _db = client.db();
    callback();
  })["catch"](function (err) {
    console.log("Error: ".concat(err));
    throw err;
  });
};

var getDb = function getDb() {
  if (_db) {
    return _db;
  }

  throw 'No dabase found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
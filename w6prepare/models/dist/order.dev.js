"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../util/database');

var Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});
module.exports = Order;
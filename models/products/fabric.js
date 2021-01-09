const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Product } = require('../product');


// TODO - validations
const Fabric = Product.discriminator('Fabric', new Schema({
  density: { type: String },
  style: { type: String },
  size: { type: String },
  length: { type: String }
}));

module.exports = mongoose.model('Fabric');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Product } = require('../product');


// TODO - validations
const Track = Product.discriminator('Track', new Schema({
  type: { type: String },
  single: { type: Boolean },
  finialStyle: { type: String },
  finialColour: { type: String },
  location: { type: String }
}));

module.exports = mongoose.model('Track');
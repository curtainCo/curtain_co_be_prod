const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Product } = require('../product');

// TODO - validations
const Accessory = Product.discriminator('Accessory', new Schema({
  type: { type: String, enum: ['Flick Stick', 'Automated', 'Tie Back', 'Other'] }
}));

module.exports = mongoose.model('Accessory');
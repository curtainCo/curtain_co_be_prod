const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// TODO - validations
const Product = new Schema({
  name: { type: String },
  colour: { type: String },
  imgUrl: { type: String },
  price: { type: Number },
  description: { type: String }
},
  {
    discriminatorKey: 'category',
    timestamps: true
  });

module.exports = {
  Product: mongoose.model('Products', Product),
  ProductSchema: Product
};
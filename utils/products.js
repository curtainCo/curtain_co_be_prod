const { Product } = require('../models/product');
const Fabric = require('../models/products/fabric');
const Track = require('../models/products/track');
const Accessory = require('../models/products/accessory');

function getAllProducts() {
  return Product.find();
}

function addProduct(req) {
  return Product.create(req.body);
}

function getProduct(req) {
  const productId = req.params.id;
  return Product.findById(productId);
}

function updateProduct(req) {
  const productId = req.params.id;
  const category = req.body.category;
  let Schema = null;

  switch (category) {
    case 'Track':
      Schema = Track;
      break;

    case 'Fabric':
      Schema = Fabric;
      break;

    default:
      Schema = Accessory;
      break;
  }
  return Schema.findOneAndUpdate({ _id: productId }, req.body, { new: true });
}

function removeProduct(req) {
  const productId = req.params.id;
  return Product.findByIdAndDelete(productId);
}

module.exports = {
  getAllProducts,
  getProduct,
  addProduct,
  updateProduct,
  removeProduct
};
const Order = require('../models/order');

function getAllOrders() {
  return Order.find().sort({ updatedAt: 1 }).populate('customer');
}

function addOrder(req) {
  return Order.create(req.body);
}

function getOrder(req) {
  const orderId = req.params.id;
  // return Order.findById(orderId).populate('customer');
  return Order.findById(orderId);
}

function updateOrder(req) {
  const orderId = req.params.id;
  return Order.findByIdAndUpdate(orderId, req.body, { new: true }).populate('customer');
}

// will not create a removeOrder route for taxing purposes?

module.exports = {
  getAllOrders,
  addOrder,
  getOrder,
  updateOrder
};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { UserSchema } = require('./user');


// TODO - validations
// TODO  - set _id from paypal's response: order_id 
const Order = new Schema({
  _id: {
    type: String,
    required: true
  },
  // had to use referencing as embedding produces weird bugs
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  // to be changed when admin process the orders?
  isProcessed: { type: Boolean, default: false },
  totalPrice: { type: Number },
  // all other data from payPal
  paymentData: {
    type: Object,
    required: true
  }
},
  { timestamps: true });

module.exports = mongoose.model('Orders', Order);
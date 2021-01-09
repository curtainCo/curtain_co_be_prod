const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Consult = new Schema({
  email: {
    type: String,
    required: true,
    maxlength: 50
  },
  title: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10
  },
  address1: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100
  },
  address2: {
    type: String
  },
  suburb: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 32
  },
  state: {
    type: String,
    enum: ['QLD', 'NSW', 'ACT', 'VIC', 'SA', 'WA', 'TAS', 'NT'],
    required: true
  },
  postcode: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4
  },
  message: {
    type: String,
    required: true
  },
  isProcessed: { type: Boolean, default: false }
},
  // adds createdAt and updatedAt attributes when saving
  // to DB
  { timestamps: true });

module.exports = mongoose.model('Consults', Consult);
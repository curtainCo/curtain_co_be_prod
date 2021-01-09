const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO - Validations
const User = new Schema({
  email: {
    type: String,
    required: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    bcrypt: true,
    minlength: 6,
    maxlength: 32
  },
  role: {
    type: String,
    default: 'user'
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
  companyName: {
    type: String,
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

  orders: [{ type: String, ref: "Orders" }]
},
  // adds createdAt and updatedAt attributes when saving
  // to DB
  { timestamps: true });

// User.index({'email': 1})
User.plugin(require('mongoose-bcrypt'));

module.exports = {
  User: mongoose.model('User', User),
  UserSchema: User
};
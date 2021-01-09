const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO - validations
const Collection = new Schema({
  name: { type: String },
  description: { type: String },
  imgUrl: { type: String },
  price: { type: Number },
  track: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
  trackTip: { type: String },
  fabric: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
  fabricTip: { type: String },
  accessory: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
  accessoryTip: { type: String }
},
  { timestamps: true });

module.exports = {
  Collection: mongoose.model('Collections', Collection),
  CollectionSchema: Collection
};
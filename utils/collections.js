const { Collection } = require('../models/collection');

function getAllCollections() {
  return Collection.find()
    .populate('track')
    .populate('fabric')
    .populate('accessory')
    .lean();
}

function addCollection(req) {
  return Collection.create(req.body);
}

function getCollection(req) {
  const collectionId = req.params.id;
  return Collection.findById(collectionId)
    .populate('track')
    .populate('fabric')
    .populate('accessory')
    .lean();
}

function updateCollection(req) {
  const collectionId = req.params.id;
  return Collection.findByIdAndUpdate(collectionId, req.body, { new: true })
    .populate('track')
    .populate('fabric')
    .populate('accessory')
    .lean();
}

function removeCollection(req) {
  const collectionId = req.params.id;
  return Collection.findByIdAndDelete(collectionId);
}

module.exports = {
  getAllCollections,
  getCollection,
  addCollection,
  updateCollection,
  removeCollection
};
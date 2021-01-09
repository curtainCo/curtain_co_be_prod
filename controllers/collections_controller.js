const { getAllCollections, getCollection, addCollection, updateCollection, removeCollection } = require('../utils/collections');

async function indexCollections(req, res) {
  try {
    const allCollections = await getAllCollections();
    res.status(200).json(allCollections);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function createCollection(req, res) {
  try {
    const newCollection = await addCollection(req);
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(400).json({ message: "Invalid Fields", error: error });
  }
}

async function showCollection(req, res) {
  try {
    const collection = await getCollection(req);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function changeCollection(req, res) {
  try {
    const updatedCollection = await updateCollection(req);

    if (!updatedCollection) {
      return res.status(400).json({ message: "Invalid Request. Collection not found" });
    }

    res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function deleteCollection(req, res) {
  try {
    const removedCollection = await removeCollection(req);

    if (!removedCollection) {
      return res.status(400).json({ message: "Collection not found. Unable to delete collection." });
    }

    res.status(202).send(removedCollection);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  indexCollections,
  createCollection,
  showCollection,
  changeCollection,
  deleteCollection
};
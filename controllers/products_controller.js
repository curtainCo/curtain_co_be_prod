const { getAllProducts, getProduct, addProduct, updateProduct, removeProduct } = require('../utils/products');

async function indexProducts(req, res) {
  try {
    const allProducts = await getAllProducts();
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// req.body has to have a category property and a valid
// value as its value (Fabric, Track, Accessory)
async function createProduct(req, res) {
  try {
    const newProduct = await addProduct(req);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error });
  }
}

async function showProduct(req, res) {
  try {
    const product = await getProduct(req);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// req.body has to have a category property and a valid
// value as its value (Fabric, Track, Accessory)
async function changeProduct(req, res) {
  try {
    const updatedProduct = await updateProduct(req);
    if (!updatedProduct) {
      return res.status(400).json({ message: "Invalid Request. Product not found." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function deleteProduct(req, res) {
  try {
    const removedProduct = await removeProduct(req);

    if (!removedProduct) {
      return res.status(400).json({ message: "Product not found. Unable to Delete Product" });
    }

    res.status(202).json(removedProduct);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  indexProducts,
  createProduct,
  showProduct,
  changeProduct,
  deleteProduct
};
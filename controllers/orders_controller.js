const { getAllOrders, addOrder, getOrder, updateOrder } = require('../utils/orders');
const { addOrderToUser } = require('../utils/users');

async function indexOrders(req, res) {
  try {
    const allOrders = await getAllOrders();
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function createOrder(req, res) {
  try {
    req.body.customer = req.user.id;
    const newOrder = await addOrder(req);
    await addOrderToUser(req.user, req.body._id);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: "Invalid Fields", error: error });
  }
}

async function showOrder(req, res) {
  try {
    const order = await getOrder(req);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function changeOrder(req, res) {
  try {
    const updatedOrder = await updateOrder(req);

    if (!updatedOrder) {
      return res.status(400).json({ message: "Invalid Request. Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// will not create a removeOrder route for taxing purposes?
// async function deleteOrder(req, res) {
//   try {
//     const removedOrder = await removeOrder(req);

//     if (!removedOrder) {
//       return res.status(400).json({ message: "Order not found. Unable to delete Order." });
//     }

//     res.status(202).send(removedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// }

module.exports = {
  indexOrders,
  createOrder,
  showOrder,
  changeOrder
};
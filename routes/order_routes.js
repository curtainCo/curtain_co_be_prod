const express = require("express");
const router = express.Router();
const {
    indexOrders,
    showOrder,
    createOrder,
    changeOrder,
    deleteOrder
} = require("../controllers/orders_controller");
const { checkAdmin, checkOrderOwner } = require("../middlewares/auth");

router.get("/", checkAdmin, indexOrders);
router.post("/", createOrder);
router.get("/:id", checkAdmin, showOrder);
router.put("/:id", checkOrderOwner, changeOrder);
router.delete("/:id", checkOrderOwner, deleteOrder);

module.exports = router;

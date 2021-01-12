const express = require("express");
const router = express.Router();
const {
    indexOrders,
    showOrder,
    createOrder,
    changeOrder,
    deleteOrder
} = require("../controllers/orders_controller");
const { checkAdmin, checkOrderOwnerOrAdmin } = require("../middlewares/auth");

router.get("/", checkAdmin, indexOrders);
router.post("/", createOrder);
router.get("/:id", checkAdmin, showOrder);
router.put("/:id", checkOrderOwnerOrAdmin, changeOrder);
router.delete("/:id", checkOrderOwnerOrAdmin, deleteOrder);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
    indexOrders,
    showOrder,
    createOrder,
    changeOrder,
} = require("../controllers/orders_controller");
const { checkAdmin } = require("../middlewares/auth");

router.get("/", checkAdmin, indexOrders);
router.post("/", createOrder);
router.get("/:id", checkAdmin, showOrder);
router.put("/:id", changeOrder);

module.exports = router;

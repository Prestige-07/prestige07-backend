const express = require("express");
const router = express.Router();

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/order");
const orders = require("../../controllers/orders");

router.post("/", validateBody(schemas.addOrderSchema), orders.addOrder);
router.get("/", authenticate, orders.getAll);
router.get("/:number", authenticate, orders.getOrderByNumber);
router.patch("/:number/update", authenticate, orders.updateOrderByNumber);

module.exports = router;

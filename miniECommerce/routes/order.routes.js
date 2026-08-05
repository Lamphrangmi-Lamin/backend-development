const express = require("express");
const { createOrder, getOrders, deleteOrderById } = require("../controllers/order.controller");

const router = express.Router();

// ? POST /orders
router.post("/", createOrder);

// ? GET /orders
router.get("/", getOrders);

// ? GET /orders/:id
router.get("/:id", deleteOrderById);

module.exports = router;

const express = require("express");
const {
  getCart,
  createCart,
  updateCartItemQuantity,
  deleteCartItemById,
} = require("../controllers/cart.controller");

const router = express.Router();

// ? GET /cart
router.get("/", getCart);

// ? POST /cart
router.post("/", createCart);

// ? PATCH /cart/:productId
router.patch("/:productId", updateCartItemQuantity);

// ? DELETE /cart/:productId
router.delete("/:productId", deleteCartItemById);

module.exports = router;

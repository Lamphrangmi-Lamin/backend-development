const express = require("express");
const router = express.Router();

const { getAllProducts, getProductById } = require("../controllers/product.controller");

// ** Endpoints implementation
// ? GET /products
router.get("/", getAllProducts);

// ? GET /products/:id
router.get("/:id", getProductById);

module.exports = router;

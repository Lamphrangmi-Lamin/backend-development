const express = require("express");
const db = require("../src");
const { productsTable } = require("../src/db/schema");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require("../controllers/product.controller");
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.patch("/:id", updateProductById);
router.delete("/:id", deleteProductById);

module.exports = router;

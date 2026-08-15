const express = require("express");
const db = require("../src");
const { productsTable } = require("../src/db/schema");
const { getAllProducts } = require("../controllers/product.controller");
const router = express.Router();

router.get("/", getAllProducts);

module.exports = router;

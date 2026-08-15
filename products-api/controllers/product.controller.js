const db = require("../src");
const { productsTable } = require("../src/db/schema");

exports.getAllProducts = async (req, res) => {
  const products = await db.select().from(productsTable);
  return res.json(products);
};

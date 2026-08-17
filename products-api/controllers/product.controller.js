const { eq } = require("drizzle-orm");
const db = require("../src");
const { productsTable } = require("../src/db/schema");

exports.getAllProducts = async (req, res) => {
  const products = await db.select().from(productsTable);
  return res.json(products);
};

exports.getProductById = async (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid product id" });

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));

  if (!product) {
    return res
      .status(404)
      .json({ error: `Product with id ${id} does not exist!` });
  }

  return res.json(product);
};

exports.createProduct = async (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || name.trim() === "")
    return res.status(400).json({ error: "name is required" });

  if (!price || isNaN(price))
    return res.status(400).json({ error: "price is required" });

  if (stock === undefined || !Number.isInteger(stock) || stock < 0)
    return res
      .status(400)
      .json({ error: "stock is required and must be a positive integer" });

  if (price <= 0)
    return res.status(400).json({ error: "price cannot be 0 or negative" });

  const [newProduct] = await db
    .insert(productsTable)
    .values({
      name: name.trim(),
      price: Number(price),
      stock,
    })
    .returning();

  return res
    .status(201)
    .json({ message: "Product created successfully", id: newProduct.id });
};

const { eq, gte, lte, and } = require("drizzle-orm");
const db = require("../src");
const { productsTable } = require("../src/db/schema");

// GET /products
exports.getAllProducts = async (req, res) => {
  const products = await db.select().from(productsTable);
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  // ** GET /products?minPrice=100&maxPrice=500
  if (minPrice && maxPrice) {
    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (isNaN(minPrice) || isNaN(maxPrice))
      return res
        .status(400)
        .json({ error: "minPrice and maxPrice must be valid number" });

    if (min > max)
      return res
        .status(400)
        .json({ error: "minPrice cannot be greater than maxPrice" });

    const filteredProducts = await db
      .select()
      .from(productsTable)
      .where(and(gte(productsTable.price, min), lte(productsTable.price, max)));

    return res.json({
      count: filteredProducts.length,
      products: filteredProducts,
    });
  }

  // ** GET /products?minPrice=100
  if (minPrice) {
    const min = Number(minPrice);

    if (isNaN(minPrice))
      return res.status(400).json({ error: "minPrice must be a number" });

    const filteredProducts = await db
      .select()
      .from(productsTable)
      .where(gte(productsTable.price, min));

    return res.json({
      count: filteredProducts.length,
      products: filteredProducts,
    });
  }

  // ** GET /products?maxPrice=500
  if (maxPrice) {
    const max = Number(maxPrice);

    if (isNaN(maxPrice))
      return res.status(400).json({ error: "maxPrice must be a valid number" });

    const filteredProducts = await db
      .select()
      .from(productsTable)
      .where(lte(productsTable.price, max));

    return res.json({
      count: filteredProducts.length,
      products: filteredProducts,
    });
  }

  return res.json(products);
};

// ** GET /products/:id
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

// POST /products
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
      price,
      stock,
    })
    .returning();

  return res
    .status(201)
    .json({ message: "Product created successfully", id: newProduct.id });
};

// PATCH /products/:id
exports.updateProductById = async (req, res) => {
  const id = Number.parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });

  const { name, price, stock } = req.body;
  const updates = {};

  if (name !== undefined) {
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "name is required" });
    }
    updates.name = name.trim();
  }

  if (price !== undefined) {
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "price cannot be negative or 0" });
    }
    updates.price = price;
  }

  if (stock !== undefined) {
    if (!Number.isInteger(stock) || stock < 0) {
      return res
        .status(400)
        .json({ error: "stock must be a non-negative integer" });
    }
    updates.stock = stock;
  }

  if (Object.keys(updates).length === 0)
    return res
      .status(400)
      .json({ error: "No valid fields provided to update" });

  const [updatedProduct] = await db
    .update(productsTable)
    .set(updates)
    .where(eq(productsTable.id, id))
    .returning();

  return res.json({
    message: "Product updated successfully in DB",
    product: updatedProduct,
  });
};

// DELETE /products/:id
exports.deleteProductById = async (req, res) => {
  const id = Number.parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });

  const [deletedProduct] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning();

  if (!deletedProduct)
    return res.status(404).json({ error: "Product not found" });

  return res.json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
};

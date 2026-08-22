const { eq, gte, lte, and, ilike } = require("drizzle-orm");
const db = require("../src");
const { productsTable, categoriesTable } = require("../src/db/schema");

// ** GET /products
exports.getAllProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, search, category, page, limit } = req.query;

    // ?? Dynamic filtering
    const filters = [];

    // ? Price filters
    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;

      if (isNaN(min) || isNaN(max))
        return res.status(400).json({ error: "Prices must be valid numbers" });

      if (min > max)
        return res
          .status(400)
          .json({ error: "minPrice cannot be greater than maxPrice" });

      if (minPrice) filters.push(gte(productsTable.price, min));
      if (maxPrice) filters.push(lte(productsTable.price, max));
    }

    // ? Search Filter ** GET /products?search=keyboard
    if (search) filters.push(ilike(productsTable.name, `%${search}%`));

    // ? GET /products?category=electronics
    if (category) filters.push(ilike(categoriesTable.name, category));

    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Math.min(Number(limit), 100) : 10;

    if (pageNumber < 1 || limitNumber < 1)
      return res
        .status(400)
        .json({ error: "Page and Limit must be greater than 0" });

    const offsetNumber = (pageNumber - 1) * limitNumber;

    // ? Build the base query
    let dbQuery = db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        price: productsTable.price,
        stock: productsTable.stock,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        created_at: productsTable.created_at,
      })
      .from(productsTable)
      .leftJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      );

    // ? Apply all filters safely
    if (filters.length > 0) dbQuery = dbQuery.where(and(...filters));

    // ? Apply pagination last
    dbQuery = dbQuery.limit(limitNumber).offset(offsetNumber);

    const paginatedProducts = await dbQuery;

    return res.status(200).json({
      metadata: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        returnedItemsCount: paginatedProducts.length,
      },
      products: paginatedProducts,
    });

    // ?? //
  } catch (error) {
    console.error("Error fetching the products", error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching products" });
  }

  //   ??
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

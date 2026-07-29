// 🟡 Problem 4 — Online Store
const products = [
  {
    id: 1,
    name: "Wireless Ergonomic Mouse",
    price: 29.99,
    stock: 150,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 89.5,
    stock: 42,
  },
  {
    id: 3,
    name: "USB-C Aluminum Hub",
    price: 45.0,
    stock: 0,
  },
  {
    id: 4,
    name: "1080p HD Webcam",
    price: 59.99,
    stock: 15,
  },
  {
    id: 5,
    name: "Adjustable Monitor Stand",
    price: 34.5,
    stock: 85,
  },
  {
    id: 6,
    name: "Noise-Cancelling Headphones",
    price: 199.99,
    stock: 12,
  },
  {
    id: 7,
    name: "Braided Charging Cable (2m)",
    price: 14.99,
    stock: 300,
  },
  {
    id: 8,
    name: "Portable SSD 1TB",
    price: 129.0,
    stock: 8,
  },
];

const express = require("express");
const app = express();
const PORT = 8002;

// Middleware
app.use(express.json());

// ROUTES

// GET /products
app.get("/products", (req, res) => {
  res.json(products);
});

// POST /products
app.post("/products", (req, res) => {
  const { name, price, stock } = req.body;
  const id = products.length + 1;

  if (!name || name === "") return res.send("Name is required");
  if (!price) return res.status(400).send("Price is required");
  if (isNaN(price)) return res.status(400).send("Price must be of type number");
  if (!stock) return res.status(400).send("Stock is required");
  if (isNaN(stock)) return res.status(400).send("Stock must be of type number");

  const newProduct = { id, name, price, stock };

  products.push(newProduct);

  res
    .status(201)
    .json({ message: "Product created successfully!", newProduct });
});

// PATCH /products/:id
app.patch("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { stock } = req.body;

  if (isNaN(id)) return res.status(400).send("ID must be of type number");

  if (stock === undefined || isNaN(stock))
    return res
      .status(400)
      .send("stock is required in request body and must be of type number");

  const targetIndex = products.findIndex((e) => e.id === id);

  if (targetIndex < 0)
    return res
      .status(404)
      .json({ error: `product with ID ${id} does not exist` });

  products[targetIndex].stock = stock;
  
  return res.json({
    message: `Stock with product ID ${id} updated successfully`,
    product: products[targetIndex],
  });
});

app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

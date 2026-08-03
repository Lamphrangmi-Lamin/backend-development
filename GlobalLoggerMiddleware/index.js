// ** In memory DB
const products = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    price: 79.99,
    stock: 10,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    price: 29.99,
    stock: 15,
  },
  {
    id: 3,
    name: "4K Monitor",
    price: 299.99,
    stock: 5,
  },
  {
    id: 4,
    name: "Noise-Cancelling Headphones",
    price: 149.99,
    stock: 8,
  },
  {
    id: 5,
    name: "Adjustable Laptop Stand",
    price: 39.99,
    stock: 20,
  },
  {
    id: 6,
    name: "USB-C Cable",
    price: 15.0,
    stock: 0, // The validation trap!
  },
];

const express = require("express");

// ** Middlewares
const { loggerMiddleware } = require("./middlewares/logger");
const { isAdmin } = require("./middlewares/adminAuthMiddleware");

const app = express();

// ** middleware
app.use(loggerMiddleware);

// ** Routes
app.get("/products", (req, res) => {
  res.json(products);
});

// ? DELETE /products/:id
app.delete("/products/:id", isAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "id must be of type number" });

  const indexToDelete = products.findIndex((e) => e.id === id);

  if (indexToDelete < 0)
    return res.status(404).json({ error: "Product does not exist" });

  products.splice(indexToDelete, 1);

  return res.json({ message: "Product removed successfully" });
});

app.listen(8000, () => console.log(`Server is up and running`));

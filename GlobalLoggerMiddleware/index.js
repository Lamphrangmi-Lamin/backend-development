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
const { loggerMiddleware } = require("./middlewares/logger");

const app = express();

// ** middleware
app.use(loggerMiddleware);

// ** Routes
app.get("/products", (req, res) => {
  res.json(products);
});

app.listen(8000, () => console.log(`Server is up and running`));

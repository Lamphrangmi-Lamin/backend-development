// ** In-memory DB
// 1. Products Collection
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
    stock: 0, // Use this to test your out-of-stock validation!
  },
];

// 2. Cart Collection
// The spec requests an array of items: { productId, quantity }
const cart = [
  {
    productId: 1,
    quantity: 10,
  },
  {
    productId: 2,
    quantity: 1,
  },
  {
    productId: 4,
    quantity: 1,
  },
  {
    productId: 5,
    quantity: 1,
  },
];

// 3. Orders Collection
// The spec requests an array of completed orders: { id, items, total, createdAt }
const orders = [];

// ** Express app
const express = require("express");
const { error } = require("node:console");
const { parse } = require("node:path");
const app = express();
const PORT = 8000;

// ** Middleware
app.use(express.json());

// ** Endpoints implementation
// ? GET /products
app.get("/products", (req, res) => {
  res.json(products);
});

// ? GET /products/:id
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "ID must be of type number" });

  const targetProduct = products.find((product) => product.id === id);
  if (!targetProduct) return res.status(404).json({ error: "Not found" });

  return res.json(targetProduct);
});

// ? GET /cart
app.get("/cart", (req, res) => {
  res.json(cart);
});

// ? POST /cart
app.post("/cart", (req, res) => {
  const { productId, quantity } = req.body;

  if (typeof productId !== "number" || !Number.isInteger(productId))
    return res.status(400).json({ error: "Invalid productId" });

  if (
    quantity <= 0 ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity)
  )
    return res.status(400).json({ error: "Invalid quantity" });

  // ** Look up for the product in DB
  const targetProduct = products.find((item) => item.id === productId);
  if (!targetProduct)
    return res.status(404).json({ error: "Product not found" });

  // ** Check if product already exist in the cart
  const productInCart = cart.find((item) => item.productId === productId);

  if (!productInCart) {
    if (quantity > targetProduct.stock)
      return res.status(409).json({
        error: "Not enough stock",
        product: targetProduct,
      });

    cart.push({ productId, quantity });
    return res.status(201).json({
      message: "Item added to cart",
      product: { productId, quantity },
    });
  }

  const newQuantity = productInCart.quantity + quantity;

  if (newQuantity > targetProduct.stock)
    return res.status(409).json({
      error: "Insufficient stock",
      product: targetProduct,
    });

  // ** Update cart item quantity
  productInCart.quantity = newQuantity;

  return res.status(201).json({
    message: "Quantity updated in cart.",
    item: productInCart,
  });
});

// ? PATCH /cart/:productId
app.patch("/cart/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;

  if (isNaN(productId))
    return res.status(400).json({ error: "productId must be of type number" });

  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 0
  )
    return res
      .status(400)
      .json({ error: "quantity must be of type number and must be positive" });

  const product = products.find((item) => item.id === productId);

  if (product === undefined)
    return res.status(404).json({ error: "Product not found" });

  const targetProductIndex = cart.findIndex(
    (item) => item.productId === productId,
  );

  if (targetProductIndex < 0)
    return res.status(404).json({
      error: `product with productId ${productId} is not found in cart`,
    });

  if (quantity === 0) {
    const removedItem = cart[targetProductIndex];
    cart.splice(targetProductIndex, 1);

    return res.json({
      message: "Product quantity set to zero so it is removed from cart",
      product: removedItem,
    });
  }

  if (quantity > product.stock)
    return res.status(409).json({ error: "Insufficient stock", product });

  cart[targetProductIndex].quantity = quantity;

  return res.json({
    message: "product quantity updated",
    product: cart[targetProductIndex],
  });
});

// ? DELETE /cart/:productId
app.delete("/cart/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);

  if (isNaN(productId))
    return res.status(400).json({ error: "productId must be of type number" });

  const indexToDelete = cart.findIndex((item) => item.productId === productId);

  if (indexToDelete === -1)
    return res.status(404).json({ error: "Product not found in cart" });

  const removedItem = cart[indexToDelete];
  cart.splice(indexToDelete, 1);

  return res.status(204).send();
});

// ? GET /orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// ? POST /orders
app.post("/orders", (req, res) => {
  if (!cart.length)
    return res.status(400).json({ error: "Cart cannot be empty" });

  let totalPrice = 0;

  // ** Get totalPrice
  for (const cartItem of cart) {
    const product = products.find(
      (product) => product.id === cartItem.productId,
    );
    if (product === undefined)
      return res.status(404).json({ error: "Product do not exist" });

    if (cartItem.quantity > product.stock)
      return res.status(400).send("Stock insufficient");

    totalPrice += cartItem.quantity * product.price;
  }

  // ** Update stock of each cart item
  for (const cartItem of cart) {
    const product = products.find(
      (product) => product.id === cartItem.productId,
    );

    product.stock -= cartItem.quantity;
  }

  // ** Cleanup and response
  const newOrder = {
    id: orders.length + 1,
    items: [...cart],
    total: totalPrice,
    createdAt: new Date(Date.now()).toISOString(),
  };

  // ** Add new order to orders
  orders.push(newOrder);

  // ** Reset cart
  cart.length = 0;

  return res.status(201).json({
    message: "Order Place successfully!",
    order: newOrder,
  });
});

// ? GET /orders/:id
// app.get("/orders/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   if (isNaN(id))
//     return res.status(400).json({ error: "id must be of type number" });

//   const order = orders.find((order) => order.productId === id);
// });

// ** Starting the server
app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

const { cart } = require("../data/cart");
const { orders } = require("../data/orders");
const { products } = require("../data/products");

exports.createOrder = (req, res) => {
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
};

exports.getOrders = (req, res) => {
  res.json(orders);
};

exports.deleteOrderById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "id must be of type number" });

  const order = orders.find((order) => order.id === id);
  if (order === undefined)
    return res.status(404).json({ error: "Order not found" });

  return res.json(order);
};

const { cart } = require("../data/cart");
const { products } = require("../data/products");

exports.getCart = (req, res) => {
  res.json(cart);
};

exports.createCart = (req, res) => {
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
};

exports.updateCartItemQuantity = (req, res) => {
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
};

exports.deleteCartItemById = (req, res) => {
  const productId = parseInt(req.params.productId);

  if (isNaN(productId))
    return res.status(400).json({ error: "productId must be of type number" });

  const indexToDelete = cart.findIndex((item) => item.productId === productId);

  if (indexToDelete === -1)
    return res.status(404).json({ error: "Product not found in cart" });

  const removedItem = cart[indexToDelete];
  cart.splice(indexToDelete, 1);

  return res.status(204).send();
};

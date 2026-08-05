const { products } = require("../data/products");

exports.getAllProducts = (req, res) => {
  res.json(products);
};

exports.getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "ID must be of type number" });

  const targetProduct = products.find((product) => product.id === id);
  if (!targetProduct) return res.status(404).json({ error: "Not found" });

  return res.json(targetProduct);
};

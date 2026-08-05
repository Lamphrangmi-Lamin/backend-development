// ** Express app
const express = require("express");
const app = express();
const PORT = 8000;

const productRouter = require("./routes/product.routes");
const cartRouter = require("./routes/cart.routes");
const orderRouter = require("./routes/order.routes");

// ** Middlewares
app.use(express.json());

app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

// ** Starting the server
app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

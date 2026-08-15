const express = require("express");
const app = express();

const productRouter = require("./routes/product.routes");

// Middlewares
app.use(express.json());

// ** Routing
app.use("/products", productRouter);

app.listen(process.env.PORT, () =>
  console.log(`HTTP server is up and running on PORT ${process.env.PORT}`),
);

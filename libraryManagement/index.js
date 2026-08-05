const path = require("path");
const express = require("express");
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env")
});

const bookRouter = require("./routes/book.routes");
const userRouter = require("./routes/user.routes");
const analyticsRouter = require("./routes/analytics.routes");
const { requestTimer } = require("../GlobalLoggerMiddleware/middlewares/requestTimer");

const app = express();



// ** Middleware
app.use(express.json());
app.use(requestTimer);

// ? Route middleware
app.use("/books", bookRouter);
app.use("/users", userRouter);
app.use("/analytics", analyticsRouter);

app.listen(8000, () => console.log("Server is up and running on PORT 8000"));

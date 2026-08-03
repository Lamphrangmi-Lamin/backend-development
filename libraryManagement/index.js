const express = require("express");
const bookRouter = require("./routes/book.routes");
const userRouter = require("./routes/user.routes");
const app = express();

// ** Middleware
app.use(express.json());

// ? Route middleware
app.use("/books", bookRouter);
app.use("/users", userRouter);

app.listen(8000, () => console.log("Server is up and running on PORT 8000"));

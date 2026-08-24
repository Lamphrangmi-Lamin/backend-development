const express = require("express");
const app = express();
const PORT = 8000;
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");

app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(PORT, () => console.log(`Server is up and running at PORT ${PORT}`));

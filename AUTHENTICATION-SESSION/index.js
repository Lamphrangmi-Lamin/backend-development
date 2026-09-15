import express from "express";

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

import { authenticationMiddleware } from "./middlewares/auth.middleware.js";

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.json());
// Auth middleware
app.use(authenticationMiddleware);

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  return res.json({ status: "Server is up and running" });
});

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));

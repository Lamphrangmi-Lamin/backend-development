import express from "express";
import authRouter from "./routes/user.routes.js";
const PORT = 8000;
const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

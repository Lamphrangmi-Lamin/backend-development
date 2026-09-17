import express from "express";
import authRouter from "./routes/auth.routes.js";
const PORT = 8000;
const app = express();

// Middlewares
app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server is up and running at PORT ${PORT}`));

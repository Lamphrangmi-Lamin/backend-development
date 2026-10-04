import express from "express";
import authRouter from "./routes/auth.routes.js";

const app = express();
const PORT = 8000;

// Middlewares
app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server is up and running at PORT ${PORT}`));

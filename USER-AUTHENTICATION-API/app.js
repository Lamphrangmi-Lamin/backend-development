import express from "express";
import authRouter from "./routes/auth.routes";
const app = express();

// Middlewares
app.use(express.json());

app.use("/auth", authRouter);

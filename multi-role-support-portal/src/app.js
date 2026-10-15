import express from "express";
import authRouter from "./routes/auth.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import { requireAuth } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = 8000;

// Middlewares
app.use(express.json());

app.use("/auth", authRouter);
app.use("/tickets", requireAuth, ticketRouter);

app.listen(PORT, () => console.log(`Server is up and running at PORT ${PORT}`));

import express from "express";
import authRouter from "./routes/user.routes.js";
import noteRouter from "./routes/note.routes.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
const PORT = 8000;
const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/notes", requireAuth, noteRouter);

app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

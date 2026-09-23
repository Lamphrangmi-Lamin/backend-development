import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.get("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", requireAuth, getCurrentUser);

export default authRouter;

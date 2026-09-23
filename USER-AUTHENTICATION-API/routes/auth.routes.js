import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.get("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", getCurrentUser);

export default authRouter;

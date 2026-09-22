import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.get("/login", loginUser);
authRouter.post("/logout", logoutUser);

export default authRouter;

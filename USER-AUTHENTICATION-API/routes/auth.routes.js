import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validateData.js";
import { loginSchema } from "../validators/loginSchema.js";
import { signupSchema } from "../validators/signupSchema.js";
const authRouter = express.Router();

authRouter.post("/register", validateData(signupSchema), registerUser);
authRouter.get("/login", validateData(loginSchema), loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", requireAuth, getCurrentUser);

export default authRouter;

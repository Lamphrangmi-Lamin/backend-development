import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validators/auth.validator.js";
const authRouter = express.Router();

authRouter.post("/register", validate(registerUserSchema), registerUser);
authRouter.get("/login", validate(loginUserSchema), loginUser);

export default authRouter;

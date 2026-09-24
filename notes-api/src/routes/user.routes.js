import express from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerUserSchema } from "../validators/auth.validator.js";
const authRouter = express.Router();

authRouter.post("/register", validate(registerUserSchema), registerUser);

export default authRouter;

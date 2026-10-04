import express from "express";
import { register } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validations/auth.validation.js";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);

export default authRouter;

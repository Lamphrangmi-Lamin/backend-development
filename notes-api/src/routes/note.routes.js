import express from "express";
import { validate } from "../middlewares/validate.js";
import { createNote } from "../controllers/note.controller.js";
import { noteSchema } from "../validators/note.validator.js";
const noteRouter = express.Router();

noteRouter.post("/", validate(noteSchema), createNote);

export default noteRouter;

import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  createNote,
  getNoteById,
  getNotes,
} from "../controllers/note.controller.js";
import { noteSchema } from "../validators/note.validator.js";
const noteRouter = express.Router();

noteRouter.post("/", validate(noteSchema), createNote);
noteRouter.get("/", getNotes);
noteRouter.get("/:id", getNoteById);

export default noteRouter;

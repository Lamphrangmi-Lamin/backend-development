import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/note.controller.js";
import { noteSchema } from "../validators/note.validator.js";
const noteRouter = express.Router();

noteRouter.post("/", validate(noteSchema), createNote);
noteRouter.get("/", getNotes);
noteRouter.get("/:id", getNoteById);
noteRouter.patch("/:id", updateNote);
noteRouter.delete("/:id", deleteNote);

export default noteRouter;

import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { notesTable } from "../db/schema.js";
import { noteIdParamsSchema } from "../validators/note.validator.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const [newNote] = await db
      .insert(notesTable)
      .values({
        title,
        content,
        userId: req.user.id,
      })
      .returning();

    return res.status(201).json(newNote);
    //
  } catch (error) {
    console.error("Error creating note: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await db.select().from(notesTable);
    return res.json(notes);
  } catch (error) {
    console.error("Error fetching notes: ", error);
    return req.status(500).json({ error: "Internal server error" });
  }
};

export const getNoteById = async (req, res) => {
  const result = noteIdParamsSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({ error: "Invalid note id" });
  }

  try {
    const noteId = result.data.id;

    const [note] = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, noteId));

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.json(note);
    //
  } catch (error) {
    console.error("Error fetching note: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

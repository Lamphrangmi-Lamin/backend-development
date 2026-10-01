import db from "../db/index.js";
import { notesTable } from "../db/schema.js";

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

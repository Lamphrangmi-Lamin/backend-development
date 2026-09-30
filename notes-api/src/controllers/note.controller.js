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

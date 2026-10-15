import db from "../db/index.js";
import { ticketsTable } from "../db/schema.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    const [newTicket] = await db
      .insert(ticketsTable)
      .values({
        title,
        description,
        customerId: req.user.userId,
      })
      .returning();

    return res.status(201).json({
      message: "New Ticket created successfully.",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating tickets: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

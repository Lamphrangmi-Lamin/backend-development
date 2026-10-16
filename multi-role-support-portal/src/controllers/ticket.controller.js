import { and, eq } from "drizzle-orm";
import db from "../db/index.js";
import { ticketsTable } from "../db/schema.js";
import { scopeFor } from "../policies/ticket.policy.js";

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

export const getTickets = async (req, res) => {
  try {
    const [ticket] = await db
      .select()
      .from(ticketsTable)
      .where(scopeFor(req.user.role));
  } catch (error) {}
};

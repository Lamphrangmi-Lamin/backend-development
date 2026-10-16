import { and, desc, eq } from "drizzle-orm";
import db from "../db/index.js";
import { ticketsTable } from "../db/schema.js";
import { scopeFor } from "../policies/ticket.policy.js";
import { AppError } from "../utils/AppError.js";
import { title } from "node:process";

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

export const listTickets = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min((Number(req.query.limit) || 20, 1), 100);
    const { status, priority } = req.query;

    if (status && !ticketsTable.status.enumValues.includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }

    if (priority && !ticketsTable.priority.enumValues.includes(priority)) {
      throw new AppError("Invalid priority filter", 400);
    }

    const where = and(
      scopeFor(req.user),
      status ? eq(ticketsTable.status, status) : undefined,
      priority ? eq(ticketsTable.priority, priority) : undefined,
    );

    const tickets = await db
      .select({
        id: ticketsTable.id,
        title: ticketsTable.title,
        status: ticketsTable.status,
        priority: ticketsTable.priority,
        customerId: ticketsTable.customerId,
        assignedAgentId: ticketsTable.assignedAgentId,
        createdAt: ticketsTable.createdAt,
      })
      .from(ticketsTable)
      .where(where)
      .orderBy(desc(ticketsTable.createdAt), desc(ticketsTable.id))
      .limit(limit)
      .offset((page - 1) * limit);

    return res.status(200).json({ tickets, page, limit });
  } catch (err) {
    next(err);
  }
};

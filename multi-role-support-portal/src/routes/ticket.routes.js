import express from "express";
import { requireRole } from "../middlewares/auth.middleware.js";
import { createTicket, listTickets } from "../controllers/ticket.controller.js";
import { validate } from "../middlewares/validate.js";
import { createTicketSchema } from "../validations/ticket.validation.js";

const ticketRouter = express.Router();

ticketRouter.post(
  "/",
  requireRole("CUSTOMER"),
  validate(createTicketSchema),
  createTicket,
);

ticketRouter.get("/", listTickets);

export default ticketRouter;

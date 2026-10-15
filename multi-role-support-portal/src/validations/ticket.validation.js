import z from "zod";

export const createTicketSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(1).max(5000),
});

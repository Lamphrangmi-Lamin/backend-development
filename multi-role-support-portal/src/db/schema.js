import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["CUSTOMER", "AGENT", "MANAGER"]);

export const usersTable = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: text().notNull(),
  role: rolesEnum("role").notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const statusEnum = pgEnum("ticket_status", [
  "open",
  "in_progress",
  "resolved",
  "closed",
]);

export const priorityEnum = pgEnum("ticket_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const ticketsTable = pgTable("tickets", {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  status: statusEnum("status").default("open").notNull(),
  priority: priorityEnum("priority").notNull(),
  customerId: integer()
    .references(() => usersTable.id)
    .notNull(),
  assignedAgentId: integer().references(() => usersTable.id),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const commentsTable = pgTable("comments", {
  id: serial().primaryKey(),
  content: text().notNull(),
  ticketId: integer()
    .references(() => ticketsTable.id, { onDelete: "cascade" })
    .notNull(),
  authorId: integer()
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

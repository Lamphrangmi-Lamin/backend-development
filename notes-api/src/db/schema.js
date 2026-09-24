import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { timeStamp } from "node:console";

export const usersTable = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const notesTable = pgTable("notes", {
  id: serial().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  userId: integer()
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

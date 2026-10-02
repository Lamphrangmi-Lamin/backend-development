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
  createdAt: timestamp().defaultNow(),
});

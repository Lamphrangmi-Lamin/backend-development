const {
  pgTable,
  varchar,
  serial,
  decimal,
  integer,
  timestamp,
} = require("drizzle-orm/pg-core");

const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 255 }),
});

const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull(),
  stock: integer().notNull().default(0),
  categoryId: integer().references(() => categoriesTable.id),
  created_at: timestamp().defaultNow(),
});

module.exports = {
  productsTable,
  categoriesTable
};

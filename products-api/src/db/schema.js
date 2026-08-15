const {
  pgTable,
  varchar,
  serial,
  decimal,
  integer,
  timestamp,
} = require("drizzle-orm/pg-core");

const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull(),
  stock: integer().notNull().default(0),
  created_at: timestamp().defaultNow(),
});

module.exports = {
  productsTable,
};

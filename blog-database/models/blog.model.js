const { uuid, pgTable, varchar, text } = require("drizzle-orm/pg-core");

const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

const postsTable = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  authorId: uuid()
    .references(() => usersTable.id)
    .notNull(),
});

const commentsTable = pgTable("comments", {
  id: uuid().primaryKey().defaultRandom(),
  content: text().notNull(),
  postId: uuid()
    .references(() => postsTable.id)
    .notNull(),
  authorId: uuid()
    .references(() => usersTable.id)
    .notNull(),
});

module.exports = {
  usersTable,
  postsTable,
  commentsTable,
};

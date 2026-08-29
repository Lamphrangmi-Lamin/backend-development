const {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
  primaryKey,
} = require("drizzle-orm/pg-core");

// students
// courses
// enrollments
const studentsTable = pgTable("students", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

const coursesTable = pgTable("courses", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).unique().notNull(),
  description: text().notNull(),
});

const enrollmentsTable = pgTable(
  "enrollments",
  {
    student_id: integer()
      .references(() => studentsTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    course_id: integer()
      .references(() => coursesTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    enrolled_at: timestamp().defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.student_id, table.course_id] }),
    //
  ],
);

module.exports = {
  studentsTable,
  coursesTable,
  enrollmentsTable,
};

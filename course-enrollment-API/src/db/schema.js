const { pgTable, serial, uuid, varchar } = require("drizzle-orm/pg-core");

// students
// courses
// enrollments
const studentsTable = pgTable("students", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

module.exports = {
  studentsTable,
};

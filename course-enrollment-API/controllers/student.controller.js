const { eq } = require("drizzle-orm");
const db = require("../src");
const {
  studentsTable,
  coursesTable,
  enrollmentsTable,
} = require("../src/db/schema");

// POST /students
exports.createStudent = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ error: "name is required" });

    if (!email || email.trim() === "")
      return res.status(400).json({ error: "email is required" });

    const newStudent = { name, email };

    await db.insert(studentsTable).values(newStudent).returning();

    return res
      .status(201)
      .json({ message: "New student created successfully", newStudent });
  } catch (error) {
    console.error("Error while creating student: ", error);
    return res.status(500).json({ error: `Internal server error` });
  }
};

// GET /students/:id/courses
exports.getCoursesByStudentId = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingStudent] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, Number(id)))
      .limit(1);

    if (!existingStudent)
      return res
        .status(404)
        .json({ error: `Student with ID ${id} does not exist` });

    const courses = await db
      .select({
        id: coursesTable.id,
        name: coursesTable.name,
        description: coursesTable.description,
        enrolledAt: enrollmentsTable.enrolled_at,
      })
      .from(coursesTable)
      .innerJoin(
        enrollmentsTable,
        eq(coursesTable.id, enrollmentsTable.course_id),
      )
      .where(eq(enrollmentsTable.student_id, Number(id)));

    return res.json({
      student: existingStudent,
      courses: courses,
    });
  } catch (error) {
    console.error("Error while fetching courses: ", error);
    return res.status(500).json({ error: `Internal server error` });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const { email, name } = req.query;

    if (email) {
      if (!email || email.trim() === "")
        return res.status(404).json({ error: "Email is required" });
    }

    if (name) {
      if (!name || name.trim() === "")
        return res.status(404).json({ error: "Name is required" });
    }

    const [existingStudent] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.email, email))
      .limit(1);

    if (!existingStudent)
      return res
        .status(404)
        .json({ error: `No student with email ${email} found` });

    return res.json(existingStudent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

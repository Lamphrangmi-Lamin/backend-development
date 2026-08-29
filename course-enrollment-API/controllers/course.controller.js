const { eq } = require("drizzle-orm");
const db = require("../src");
const { coursesTable, studentsTable, enrollmentsTable } = require("../src/db/schema");

// POST /courses
exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ error: "name is required" });

    if (!description || description.trim() === "")
      return res.status(400).json({ error: "description is required" });

    const newCourse = { name, description };

    const [result] = await db
      .insert(coursesTable)
      .values(newCourse)
      .returning();

    return res.status(201).json({
      message: "Course created successfully",
      course: result,
    });
  } catch (error) {
    console.error("Error while creating course: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /courses/:id/students
exports.getAllStudentsByCourseId = async (req, res) => {
  try {
    const courseId = Number(req.params.id);

    if (isNaN(courseId))
      return res
        .status(400)
        .json({ error: "courseId must be an integer number" });

    const [existingCourse] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);

    if (!existingCourse)
      return res
        .status(404)
        .json({ error: `No course found with ID ${courseId}` });

    const students = await db
      .select({
        id: studentsTable.id,
        name: studentsTable.name,
        email: studentsTable.email,
        enrolledAt: enrollmentsTable.enrolled_at,
      })
      .from(studentsTable)
      .innerJoin(
        enrollmentsTable,
        eq(enrollmentsTable.student_id, studentsTable.id),
      )
      .where(eq(enrollmentsTable.course_id, courseId));

    return res.json({
      course: existingCourse,
      students: students,
    });
  } catch (error) {
    console.error("Error while fetching students: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

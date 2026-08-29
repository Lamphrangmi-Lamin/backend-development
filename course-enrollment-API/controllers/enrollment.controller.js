const db = require("../src");
const { enrollmentsTable } = require("../src/db/schema");

exports.createEnrollment = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    if (!student_id)
      return res.status(400).json({ error: "studentId is required" });

    if (!course_id)
      return res.status(400).json({ error: "courseId is required" });

    const newEnrollment = { student_id, course_id };

    const [result] = await db
      .insert(enrollmentsTable)
      .values(newEnrollment)
      .returning();

    return res.status(201).json({
      message: "Enrollment created successfully",
      enrollment: result,
    });
  } catch (error) {
    console.error("Error while creating enrollment: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

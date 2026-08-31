const express = require("express");
const {
  createStudent,
  getCoursesByStudentId,
  getStudents,
} = require("../controllers/student.controller");
const router = express.Router();

router.post("/", createStudent);
router.get("/:id/courses", getCoursesByStudentId);
router.get("/", getStudents);
module.exports = router;

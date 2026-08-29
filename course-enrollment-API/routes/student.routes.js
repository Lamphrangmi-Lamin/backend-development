const express = require("express");
const {
  createStudent,
  getCoursesByStudentId,
} = require("../controllers/student.controller");
const router = express.Router();

router.post("/", createStudent);
router.get("/:id/courses", getCoursesByStudentId);

module.exports = router;

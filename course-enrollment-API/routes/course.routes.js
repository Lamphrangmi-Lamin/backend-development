const express = require("express");
const { createCourse, getAllStudentsByCourseId } = require("../controllers/course.controller");

const router = express.Router();

router.post("/", createCourse);
router.get("/:id/students", getAllStudentsByCourseId);

module.exports = router;

const express = require("express");
const { createEnrollment } = require("../controllers/enrollment.controller");
const router = express.Router();

router.post("/", createEnrollment);

module.exports = router;

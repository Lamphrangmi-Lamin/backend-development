const express = require("express");

const {
  createAttendee,
  getAllAttendees,
} = require("../controllers/attendee.controller");

const { auth } = require("../middleware/auth");

const router = express.Router();

// * POST /attendees
router.post("/", auth, createAttendee);

// * GET /attendees, /attendees?eventId=2
router.get("/", getAllAttendees);

module.exports = router;

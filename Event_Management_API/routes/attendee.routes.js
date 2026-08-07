const express = require("express");

const { ATTENDEES } = require("../model/attendees");
const { EVENTS } = require("../model/events");
const {
  createAttendee,
  getAllAttendees,
} = require("../controllers/attendee.controller");

const router = express.Router();

// * POST /attendees
router.post("/", createAttendee);

// * GET /attendees, /attendees?eventId=2
router.get("/", getAllAttendees);

module.exports = router;

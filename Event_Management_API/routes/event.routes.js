const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEventById,
  deleteEventById,
} = require("../controllers/event.controller");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.patch("/:id", updateEventById);
router.delete("/:id", deleteEventById)

module.exports = router;

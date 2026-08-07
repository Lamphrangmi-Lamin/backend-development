const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEventById,
  deleteEventById,
} = require("../controllers/event.controller");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", auth, createEvent);
router.patch("/:id", auth, updateEventById);
router.delete("/:id", auth, deleteEventById);

module.exports = router;

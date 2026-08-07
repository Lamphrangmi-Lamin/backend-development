const { type } = require("node:os");
const { ATTENDEES } = require("../model/attendees");
const { EVENTS } = require("../model/events");

exports.getAllAttendees = (req, res) => {
  const { eventId } = req.query;

  if (!eventId || typeof eventId !== "string" || eventId.trim() === "")
    return res.json(ATTENDEES);

  const filteredAttendees = ATTENDEES.filter((att) => att.eventId === eventId);

  return res.json(filteredAttendees);
};

exports.createAttendee = (req, res) => {
  const { name, email, eventId } = req.body;

  if (!name || name.trim() === "")
    return res.status(400).json({ error: "name must be a non-empty string" });

  if (!email || email.trim() === "")
    return res.status(400).json({ error: "email must be a non-empty string" });

  if (!eventId || eventId.trim() === "")
    return res.status(400).json({ error: "eventId is required" });

  const event = EVENTS.find((evt) => evt.id === eventId);

  if (event === undefined)
    return res
      .status(404)
      .json({ error: `event with ID ${eventId} not found` });

  if (event.seatsAvailable <= 0)
    return res.status(409).json({ error: "Event is sold out" });

  const existingAttendee = ATTENDEES.find((att) => att.email === email);

  if (existingAttendee !== undefined)
    return res
      .status(409)
      .json({ error: `Attendee with email ${email} already exists` });

  event.seatsAvailable -= 1;

  const userId = ATTENDEES.length + 1;

  const newAttendee = {
    id: `att_10${userId}`,
    name,
    email,
    eventId,
  };

  ATTENDEES.push(newAttendee);

  return res.status(201).json(newAttendee);
};

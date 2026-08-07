const { error, timeLog } = require("node:console");
const { EVENTS } = require("../model/events");

// * GET /events
exports.getAllEvents = (req, res) => {
  res.json(EVENTS);
};

// * GET /events/:id
exports.getEventById = (req, res) => {
  const id = req.params.id;

  const event = EVENTS.find((e) => e.id === id);

  if (event === undefined)
    return res.status(404).json({ error: "event does not exist" });

  return res.json(event);
};

// * POST /events
exports.createEvent = (req, res) => {
  const { title, date, venue, seatsAvailable = 0 } = req.body;

  if (!title || !date || !venue)
    return res.status(400).json({
      error: "Missing required fields: title, date, and venue are required.",
    });

  if (typeof seatsAvailable !== "number" || !Number.isInteger(seatsAvailable))
    return res
      .status(400)
      .json({ error: "seatsAvailable must be of type number" });

  const newEvent = {
    id: `evt_${Date.now()}`,
    title,
    date,
    venue,
    seatsAvailable: seatsAvailable || 0,
  };

  EVENTS.push(newEvent);

  return res.status(201).json(newEvent);
};

// * PATCH /events/:id
exports.updateEventById = (req, res) => {
  const id = req.params.id;

  const { title, venue, date, seatsAvailable } = req.body;

  const targetIndex = EVENTS.findIndex((evt) => evt.id === id);

  if (targetIndex === -1)
    return res.status(404).json({ error: "Event not found" });

  const updates = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ error: "title must be a non-empty string" });
    }
    updates.title = title;
  }

  if (venue !== undefined) {
    if (typeof venue !== "string" || venue.trim() === "") {
      return res
        .status(400)
        .json({ error: "venue must be a non-empty string" });
    }
    updates.venue = venue;
  }

  if (date !== undefined) {
    if (typeof date !== "string" || date.trim() === "") {
      return res.status(400).json({ error: "date must be a non-empty string" });
    }
    updates.date = date;
  }

  if (seatsAvailable !== undefined) {
    if (
      typeof seatsAvailable !== "number" ||
      !Number.isInteger(seatsAvailable)
    ) {
      return res
        .status(400)
        .json({ error: "seatsAvailable must be an integer number" });
    }
    updates.seatsAvailable = seatsAvailable;
  }

  EVENTS[targetIndex] = {
    ...EVENTS[targetIndex],
    ...updates,
  };

  return res.json({
    message: "Event details updated",
    event: EVENTS[targetIndex],
  });
};

// * DELETE /events/:id
exports.deleteEventById = (req, res) => {
  const id = req.params.id;

  const targetIndex = EVENTS.findIndex((evt) => evt.id === id);

  if (targetIndex === -1)
    return res.status(404).json({ error: "Event not found" });

  EVENTS.splice(targetIndex, 1);

  return res.status(204).send();
};

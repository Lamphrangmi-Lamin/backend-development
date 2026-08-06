const { EVENTS } = require("../model/events");

exports.getAllEvents = (req, res) => {
  res.json(EVENTS);
};

exports.getEventById = (req, res) => {
    const id = req.params.id;
}
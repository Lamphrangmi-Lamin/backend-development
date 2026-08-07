const express = require("express");
const app = express();
const PORT = 8000;

const eventRouter = require("./routes/event.routes");
const attendeeRouter = require("./routes/attendee.routes")

// Middleware utility
app.use(express.json());

// ** Routes
app.use("/events", eventRouter);
app.use("/attendees", attendeeRouter)

app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

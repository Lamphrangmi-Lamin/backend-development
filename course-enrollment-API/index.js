const express = require("express");
const app = express();
const PORT = 8000;

const studentRouter = require("./routes/student.routes");
const courseRouter = require("./routes/course.routes");
const enrollmentRouter = require("./routes/enrollment.routes");

// Middleware
app.use(express.json());

app.use("/students", studentRouter);
app.use("/courses", courseRouter);
app.use("/enrollments", enrollmentRouter);

app.listen(PORT, () => console.log(`Server is up and running at PORT ${PORT}`));

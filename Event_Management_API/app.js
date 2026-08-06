const express = require("express");
const app = express();
const PORT = 8000;

// Middleware utility
app.use(express.json());

app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

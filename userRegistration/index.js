const express = require("express");
const app = express();

// ** Middleware
app.use(express.json());

const users = [
  {
    id: 1,
    username: "alex_dev",
    email: "alex@example.com",
  },
  {
    id: 2,
    username: "code_ninja",
    email: "ninja@test.com",
  },
  {
    id: 3,
    username: "sarah_codes",
    email: "sarah@domain.com",
  },
];

app.post("/users", (req, res) => {
  const { username, email } = req.body;

  if (!username || !email || username.trim() === "" || email.trim() === "")
    return res.status(400).json({ error: "username and email are required" });

  // ** Check if email already exist
  const emailExists = users.some((user) => user.email === email);
  if (emailExists)
    return res
      .status(409)
      .json({ error: `user with email ${email} already exist` });

  const id = users.length + 1;
  const newUser = {
    id,
    username,
    email,
  };

  users.push(newUser);

  return res
    .status(201)
    .json({ message: "User created successfully", user: newUser });
});

app.listen(8006, () => console.log("Server is up and running on PORT 8006"));

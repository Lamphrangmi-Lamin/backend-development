const { usersTable } = require("../models/blog.model");
const db = require("../db/index");

exports.createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || name.trim() === "")
    return res.status(400).json({ error: "Name is invalid" });

  if (!email || email.trim() === "")
    return res.status(400).json({ error: "Email is invalid" });

  const [newUser] = await db
    .insert(usersTable)
    .values({
      name,
      email,
    })
    .returning();

  return res
    .status(201)
    .json({ message: "New user created in DB", user: newUser });
};

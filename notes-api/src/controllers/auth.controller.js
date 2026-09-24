import bcrypt from "bcrypt";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // hash the incoming password
  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(usersTable).values({ name, email, passwordHash });

  return res.status(201).json({ message: "User registered successfully" });
};

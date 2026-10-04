import bcrypt from "bcrypt";
import { usersTable } from "../db/schema.js";
import db from "../db/index.js";

export const register = async (req, res) => {
  try {
    // Validate data using Zod
    const { name, email, password, role } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({
      name,
      email,
      passwordHash,
      role,
    });

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    if (error?.code === "23505") {
      return res.status(409).json({
        message: "User already exist",
      });
    }

    console.error("Error creating user: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

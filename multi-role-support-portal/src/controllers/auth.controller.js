import bcrypt from "bcrypt";
import { usersTable } from "../db/schema.js";
import db from "../db/index.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db
      .select({
        id: usersTable.id,
        passwordHash: usersTable.passwordHash,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If password and email are valid send jwt token to the user
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({ message: "Logged in successful", token });
  } catch (error) {
    console.error("Error logging in: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

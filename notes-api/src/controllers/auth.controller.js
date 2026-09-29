import bcrypt from "bcrypt";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [existingUser] = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // hash the incoming password
    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({ name, email, passwordHash });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error creating user: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db
      .select({ id: usersTable.id, passwordHash: usersTable.passwordHash })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(401).json({ error: `Invalid credentials` });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the token to the response body
    res.setHeader(
      "Set-Cookie",
      `jwt=${token}; HttpOnly; Path=/; Secure; SameSite=Lax`,
    );

    return res.status(200).json({ message: "Logged in" }); // No token in the body!
  } catch (error) {
    console.error("Error while logging in: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

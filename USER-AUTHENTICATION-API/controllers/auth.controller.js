import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { createHmac, randomBytes } from "node:crypto";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ error: "Name is required" });

    if (!email || email.trim() === "")
      return res.status(400).json({ error: "Email is required" });

    if (!password)
      return res.status(400).json({ error: "Password is required" });

    const [existingUser] = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser)
      return res
        .status(409)
        .json({ error: `User with email ID ${email} already exists` });

    const salt = randomBytes(256).toString("hex");

    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
        salt,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

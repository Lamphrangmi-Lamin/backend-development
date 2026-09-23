import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { sessionsTable, usersTable } from "../db/schema.js";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getValidSessionId } from "../utils/auth.js";

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || email.trim() === "")
      return res.status(400).json({ error: "Email is required" });

    if (!password)
      return res.status(400).json({ error: "Password is required." });

    const [existingUser] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        salt: usersTable.salt,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!existingUser)
      return res.status(404).json({ error: "Invalid email or password" });

    const expectedHashBuffer = Buffer.from(existingUser.password, "hex");

    const newHashBuffer = createHmac("sha256", existingUser.salt)
      .update(password)
      .digest();

    if (
      expectedHashBuffer.length !== newHashBuffer.length ||
      !timingSafeEqual(expectedHashBuffer, newHashBuffer)
    )
      return res.status(401).json({ error: "Invalid email or password" });

    // SESSION CREATION

    // Generate a cryptographically secure random Session ID
    const sessionId = randomBytes(32).toString("hex");

    // Duration
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // Store the session to the database
    await db.insert(sessionsTable).values({
      id: sessionId,
      userId: existingUser.id,
      expiresAt: new Date(Date.now() + ONE_DAY_MS),
    });

    // Send the signed cookie to the client
    const COOKIE_SECRET = process.env.COOKIE_SECRET;
    const signature = createHmac("sha256", COOKIE_SECRET)
      .update(sessionId)
      .digest("base64url");

    const signedCookie = `${sessionId}.${signature}`;

    res.setHeader("Set-cookie", [
      `sid=${signedCookie}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`,
    ]);

    // Return HTTP response with proper message
    return res.status(200).json({ message: "Login successful" });
    //
  } catch (error) {
    console.error("Error logging user: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const sessionId = getValidSessionId(req.headers.cookie);

    if (sessionId)
      await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));

    res.setHeader("Set-cookie", [
      "sid=; HttpOnly; Path=/; Max-Age=0 SameSite=Lax",
    ]);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout: ", error);
    res.setHeader("Set-Cookie", [
      "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
    ]);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCurrentUser = (req, res) => {
  return res.status(200).json(req.user);
};

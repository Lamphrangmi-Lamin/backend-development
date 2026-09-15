import express from "express";
import db from "../db/index.js";
import { userSessions, usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch("/", ensureAuthenticated, async (req, res) => {
  const { name } = req.body;

  await db.update(usersTable).set({ name }).where(eq(usersTable.id, user.id));

  return res.json({ status: "Success" });
});

router.get("/", ensureAuthenticated, async (req, res) => {
  return res.json({ user });
}); // Returns current logged in user

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const [existingUser] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser) {
    return res
      .status(400)
      .json({ error: `User with email ${email} already exists!` });
  }

  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id });

  return res.status(201).json({
    status: "Success",
    data: { userId: user.id },
  });
  //
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      salt: usersTable.salt,
      role: usersTable.role,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!existingUser)
    return res
      .status(404)
      .json({ error: `User with email ${email} does not exists` });

  const salt = existingUser.salt;
  const existingHash = existingUser.password;

  const newHash = createHmac("sha256", salt).update(password).digest("hex");

  if (existingHash !== newHash)
    return res.status(400).json({ error: "Incorrect password!" });

  // Generate token for user
  const payload = {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return res.json({ status: "Success", token });
});

export default router;

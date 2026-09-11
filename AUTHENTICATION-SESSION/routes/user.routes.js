import express from "express";
import db from "../db/index.js";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";

const router = express.Router();

router.get("/"); // Returns current logged in user

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser)
    return res
      .status(400)
      .json({ error: `User with email ${email} already exists!` });

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
router.post("/login");

export default router;

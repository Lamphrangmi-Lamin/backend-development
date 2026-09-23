import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { sessionsTable, usersTable } from "../db/schema.js";
import { getValidSessionId } from "../utils/auth.js";

export const requireAuth = async (req, res, next) => {
  try {
    const sessionId = getValidSessionId(req.headers.cookie);

    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [sessionRecord] = await db
      .select({
        expiresAt: sessionsTable.expiresAt,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
      })
      .from(sessionsTable)
      .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
      .where(eq(sessionsTable.id, sessionId));

    if (!sessionRecord) {
      return res.status(401).json({ user: null, error: "Session not found" });
    }

    if (new Date() > new Date(sessionRecord.expiresAt)) {
      res.setHeader("Set-Cookie", [
        "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
      ]);
      await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
      return res.status(401).json({ error: "Session expired" });
    }

    req.user = sessionRecord.user;

    next();
  } catch (error) {
    console.error("Error authenticating user: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

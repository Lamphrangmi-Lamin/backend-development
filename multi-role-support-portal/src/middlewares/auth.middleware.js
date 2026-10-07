import jwt from "jsonwebtoken";
import { rolesEnum } from "../db/schema.js";

export const requireAuth = (req, res, next) => {
  try {
    // Read the Authorization header
    const authHeader = req.headers.authorization;

    // Validate format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach req.user
    req.user = decoded;

    // Pass control to the next route handler
    next();
  } catch (error) {
    console.error("Invalid or expired token: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const requireRole = (...allowedRoles) => {
  if (allowedRoles.length === 0) {
    throw new Error("requireRole() needs at least one role");
  }

  for (const role of allowedRoles) {
    if (!rolesEnum.enumValues.includes(role)) {
      throw new Error(
        `Invalid role ${JSON.stringify(role)}. ` +
          `Valid roles: ${rolesEnum.enumValues.join(", ")}`,
      );
    }
  }

  const allowed = new Set(allowedRoles);
  //
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (!allowed.has(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
};

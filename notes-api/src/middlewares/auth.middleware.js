import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decodedPayload.userId };

    next();
    //
  } catch (error) {
    console.error("JWT Verification Error: ", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }

    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

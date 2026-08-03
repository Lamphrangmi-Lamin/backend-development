const { error } = require("node:console");

exports.isAdmin = function (req, res, next) {
  const token = req.headers.authorization?.trim();

  if (!token) {
    return res.status(400).json({ error: "missing credentials" });
  }

  if (token === "admin123") {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
};

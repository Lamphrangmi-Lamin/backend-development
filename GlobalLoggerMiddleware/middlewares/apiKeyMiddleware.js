exports.apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) 
    return res.status(401).json({ error: "Missing API key" });

  if (apiKey !== process.env.API_KEY) 
    return res.status(403).send("Forbidden");

  next();
};

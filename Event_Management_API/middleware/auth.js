exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization !== "admin123") return res.status(401).send();

  next();
};

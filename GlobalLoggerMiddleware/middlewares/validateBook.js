exports.validateBook = function (req, res, next) {
  const { title, author } = req.body;

  if (!title || title.trim() === "")
    return res.status(400).json({ error: "title is required" });

  if (!author || author.trim() === "")
    return res.status(400).json({ error: "author is required" });

  next();
};

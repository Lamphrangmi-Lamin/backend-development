const fs = require("node:fs");

exports.logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  const log = `${method} ${url} ${timestamp}\n`;
  fs.appendFileSync("./log.txt", log, "utf8");

  next();
};

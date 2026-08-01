const fs = require("node:fs");

exports.loggerMiddleware = function (req, res, next) {
  const log = `[${new Date(Date.now())}]\n${req.method} ${req.path}`;
  fs.appendFileSync("./log.txt", log, "utf8");
  next();
};

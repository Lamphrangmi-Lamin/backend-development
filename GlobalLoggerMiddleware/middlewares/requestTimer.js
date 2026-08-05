exports.requestTimer = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start);
    console.log(
      `${req.method} ${req.originalUrl} - Completed in ${durationMs.toFixed(2)} ms`,
    );
  });

  next();
};

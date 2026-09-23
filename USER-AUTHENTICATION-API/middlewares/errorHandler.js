export const globalErrorHandler = (err, req, res, next) => {
  console.err("CRITICAL SYSTEM ERROR: ", err);

  res
    .status(500)
    .json({ error: "An unexpected internal server error occurred" });
};

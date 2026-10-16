import { AppError } from "../utils/AppError.js";

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}, 404`));
};

export const errorHandler = (err, req, res, next) => {
  if (req.headersSent) return next(err);

  let status = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Malformed JSON body";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "Request body too large";
  } else {
    const pgCode = err.code ?? err.cause?.code;
    if (pgCode === "23505") {
      status = 409;
      message = "Resource already exists";
    } else if (pgCode === "23503") {
      status = 409;
      message = "Referenced resource does not exist";
    } else if (pgCode === "22P02") {
      status = 400;
      message = "Invalid input format";
    }
  }

  if (status >= 500) {
    console.error({
      err,
      method: req.method,
      path: req.originalUrl,
      userId: req.user?.userId,
    });
  }

  return res.status(status).json({ error: message });
};

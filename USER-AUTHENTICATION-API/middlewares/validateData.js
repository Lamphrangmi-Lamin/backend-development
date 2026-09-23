export const validateData = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const errorMessages = error.issues.map((err) => err.message);
      return res.status(400).json({ error: errorMessages });
    }
  };
};

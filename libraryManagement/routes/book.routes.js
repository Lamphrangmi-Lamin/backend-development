const express = require("express");
const {
  getAllBooks,
  getBookById,
  createBook,
  deleteBookById,
  borrowBookById,
} = require("../controllers/book.controller");
const { validateBook } = require("../../GlobalLoggerMiddleware/middlewares/validateBook");
const router = express.Router();

// ? GET /books
router.get("/", getAllBooks);

// ? GET /books/:id
router.get("/:id", getBookById);

// ? POST /books
router.post("/", validateBook, createBook);

// ? PATCH /books/:id/borrow
router.patch("/:id/borrow", borrowBookById);

// ? DELETE /books/:id/
router.delete("/:id", deleteBookById);

module.exports = router;

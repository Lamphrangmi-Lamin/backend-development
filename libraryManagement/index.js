const express = require("express");
const app = express();

const books = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    available: true,
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    available: false,
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm",
    available: true,
  },
  {
    id: 4,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    available: true,
  },
  {
    id: 5,
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    available: false,
  },
];

// * PATCH /books/:id/borrow
app.patch("/books/:id/borrow", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "ID must be of type number" });

  const targetIndex = books.findIndex((book) => book.id === id);

  if (targetIndex < 0)
    return res.status(404).json({ error: `Book with ID ${id} not found` });

  const targetBook = books[targetIndex];

  if (!targetBook.available)
    return res.status(409).json({
      message: "Book unavailable",
    });

  // * Perform borrow action
  targetBook.available = false;

  return res.json({
    message: "Book borrowed successfully",
    book: targetBook,
  });
});

app.listen(8004, () => console.log("Server is up and running on PORT 8004"));

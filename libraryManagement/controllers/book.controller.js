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

exports.getAllBooks = (req, res) => {
  res.json(books);
};

exports.getBookById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "id must be of type number" });

  const targetBook = books.find((e) => e.id === id);

  if (targetBook === undefined)
    return res.status(404).json({ error: "Book not found" });

  return res.json(targetBook);
};

exports.createBook = (req, res) => {
  const { title, author } = req.body;

  const id = books.length + 1;

  const newBook = { id, title, author, available: true };

  books.push(newBook);

  return res.status(201).json({ message: "Book created", newBook });
};

exports.borrowBookById = (req, res) => {
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
};

exports.deleteBookById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "id must be of type number" });

  const targetIndex = books.findIndex((e) => e.id === id);

  if (targetIndex < 0)
    return res.status(404).json({ error: "Book does not exist" });

  books.splice(targetIndex, 1);

  return res.json({ message: "Book deleted" });
};

const express = require("express");
const app = express();

// In memory DB
const movies = [
  {
    id: 1,
    title: "Inception",
    genre: "Sci-Fi",
    rating: 8.8,
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre: "Action",
    rating: 9.0,
  },
  {
    id: 3,
    title: "Parasite",
    genre: "Thriller",
    rating: 8.6,
  },
  {
    id: 4,
    title: "Spirited Away",
    genre: "Animation",
    rating: 8.6,
  },
  {
    id: 5,
    title: "Everything Everywhere All at Once",
    genre: "Sci-Fi",
    rating: 7.8,
  },
  {
    id: 6,
    title: "Goodfellas",
    genre: "Crime",
    rating: 8.7,
  },
  {
    id: 7,
    title: "The Grand Budapest Hotel",
    genre: "Comedy",
    rating: 8.1,
  },
  {
    id: 8,
    title: "Mad Max: Fury Road",
    genre: "Action",
    rating: 8.1,
  },
];

// Middleware
app.use(express.json());

// ROUTES

// GET /movies
// app.get("/movies", (req, res) => {
//   return res.json(movies);
// });

// GET /movies/:id
app.get("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);

  if (isNaN(movieId))
    return res.status(400).json({ error: "ID must be of type number" });

  const targetMovie = movies.find((movie) => movie.id === movieId);

  if (!targetMovie)
    return res
      .status(404)
      .json({ error: `Movie with ID ${movieId} does not exist!` });

  return res.json(targetMovie);
});

// POST /movies
app.post("/movies", (req, res) => {
  const { title, genre, rating } = req.body;

  if (!title) return res.status(400).send(`title is required`);

  if (!genre) return res.status(400).send(`genre is required`);

  if (!rating) return res.status(400).send(`rating is required`);

  if (isNaN(rating))
    return res.status(400).send(`Rating must be of type number`);

  const id = movies.length + 1;

  const newMovie = { id, title, genre, rating };

  movies.push(newMovie);

  return res
    .status(201)
    .json({ message: "movie created successfully", movie: newMovie });
});

// DELETE /movies/:id
app.delete("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.send(`ID must be of type number`);

  const indexToDelete = movies.findIndex((e) => e.id === id);

  if (indexToDelete < 0)
    return res.status(404).send(`Movie with ID ${id} not found in database`);

  movies.splice(indexToDelete, 1);

  return res.json({ message: `movie with ID ${id} deleted successfully` });
});

// GET /movies?genre=Action
app.get("/movies", (req, res) => {
  const { genre } = req.query;

  let filteredMovies = movies;

  if (genre !== undefined) {
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.genre.toLowerCase() === genre.toLowerCase();
    });
  }

  return res.json(filteredMovies);
});

app.listen(8001, () => console.log("Server is up and running on PORT 8001"));

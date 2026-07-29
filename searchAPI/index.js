const videos = [
  {
    id: "vX7b2qwT9gZ",
    title: "Node.js API Tutorial for Beginners",
    channelName: "Dev Mastery",
    views: 1250400,
    tags: ["javascript", "backend", "express"],
    publishedAt: "2025-11-12",
  },
  {
    id: "aP8m9kxR3qW",
    title: "Lofi Hip Hop Radio - Beats to Relax/Study to",
    channelName: "ChillVibes",
    views: 85400000,
    tags: ["music", "lofi", "study"],
    publishedAt: "2024-02-20",
  },
  {
    id: "mN2b4vcX7kY",
    title: "10 JavaScript Array Methods You Must Know",
    channelName: "Dev Mastery",
    views: 340000,
    tags: ["javascript", "frontend", "tips"],
    publishedAt: "2026-01-15",
  },
  {
    id: "tH9z1qwP4mN",
    title: "My Minimal Desk Setup 2026",
    channelName: "Tech Aesthetics",
    views: 89000,
    tags: ["tech", "setup", "productivity"],
    publishedAt: "2026-06-05",
  },
  {
    id: "qW3m5erT8yU",
    title: "REST APIs Explained in 5 Minutes",
    channelName: "Tech Simplified",
    views: 2100500,
    tags: ["backend", "api", "rest"],
    publishedAt: "2023-08-30",
  },
  {
    id: "pL6m9noR2sT",
    title: "Why I Switched from VS Code to Cursor",
    channelName: "Code Daily",
    views: 150000,
    tags: ["tech", "editor", "productivity"],
    publishedAt: "2026-05-10",
  },
  {
    id: "bV8c2xzM4kL",
    title: "Learn Express.js in 1 Hour",
    channelName: "Backend Builder",
    views: 75000,
    tags: ["javascript", "backend", "express"],
    publishedAt: "2026-07-20",
  },
  {
    id: "jK5n8pqW7mT",
    title: "Ultimate 4K Drone Footage - Switzerland",
    channelName: "Travel Explorer",
    views: 3200000,
    tags: ["travel", "drone", "4k"],
    publishedAt: "2025-09-18",
  },
];

const express = require("express");
const app = express();
const PORT = 8003;

// ROUTES
// GET /search?title=node
app.get("/search", (req, res) => {
  const { title } = req.query;

  if (typeof title !== "string" || title.trim() === "")
    return res
      .status(400)
      .json({ error: "title search query is absent in the url" });

  let filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(title.toLowerCase()),
  );

  return res.json(filteredVideos);
});

app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

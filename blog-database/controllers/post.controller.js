const db = require("../db");
const { postsTable } = require("../models/blog.model");

exports.createPost = async (req, res) => {
  const { title, content, authorId } = req.body;

  if (!title || title.trim() === "")
    return res.status(400).json({ error: "Title is required" });

  if (!content || content.trim() === "")
    return res.status(400).json({ error: "Content is required" });

  if (!authorId) return res.status(400).json({ error: "AuthorId is required" });

  const [newPost] = await db
    .insert(postsTable)
    .values({
      title,
      content,
      authorId: "9548c3f7-1d1c-48b4-8330-7d5966bcfd35",
    })
    .returning();

  return res
    .status(201)
    .json({ message: "new post created successfully", post: newPost });
};

const { eq } = require("drizzle-orm");
const db = require("../db");
const {
  postsTable,
  usersTable,
  commentsTable,
} = require("../models/blog.model");
const { patch } = require("../routes/user.routes");

exports.createPost = async (req, res) => {
  // Wrap everything in a try/catch
  try {
    const { title, content, authorId } = req.body;

    // 1. Validate inputs
    if (!title || title.trim() === "")
      return res.status(400).json({ error: "Title is required" });

    if (!content || content.trim() === "")
      return res.status(400).json({ error: "Content is required" });

    if (!authorId)
      return res.status(400).json({ error: "AuthorId is required" });

    // 2. Check if user exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, authorId))
      .limit(1);

    // 3. Enforce business rule
    if (existingUser.length === 0) {
      return res.status(404).json({
        error: `User with ID ${authorId} does not exist. Cannot create post.`,
      });
    }

    // 4. Insert the new post
    const [newPost] = await db
      .insert(postsTable)
      .values({
        title,
        content,
        authorId,
      })
      .returning();

    return res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    // Safely catch any unexpected database errors
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while creating post" });
  }
};

// GET /posts/:id
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const [existingPost] = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        content: postsTable.content,
        author: {
          id: usersTable.id,
          name: usersTable.name,
        },
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(usersTable.id, postsTable.authorId))
      .where(eq(postsTable.id, postId))
      .limit(1);

    if (!existingPost)
      return res.status(404).json({ error: `No post found with ID ${postId}` });

    return res.json(existingPost);
    // **
  } catch (error) {
    console.error("Error while fetching post: ", error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching post" });
  }
};

// POST /posts/:id/comments
exports.createCommentByPostId = async (req, res) => {
  const postId = req.params.id;

  const { content, authorId } = req.body;

  if (!authorId) return res.status(400).json({ error: "AuthorId is required" });

  if (!content || content.trim() === "")
    return res.status(400).json({ error: "content is required" });

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, authorId))
    .limit(1);

  if (!existingUser)
    return res.status(404).json({ error: `No user found with ID ${authorId}` });

  const [existingPost] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, postId))
    .limit(1);

  if (!existingPost)
    return res.status(404).json({ error: `Post with ID ${postId} not found` });

  const [newComment] = await db
    .insert(commentsTable)
    .values({
      content,
      postId,
      authorId,
    })
    .returning();

  return res
    .status(201)
    .json({ message: "comment created successfully", comment: newComment });
};

// GET /posts/:id/comments
exports.getAllCommentsByPostId = async (req, res) => {
  const postId = req.params.id;

  const [existingPost] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, postId))
    .limit(1);

  if (!existingPost)
    return res.status(404).json({ error: `No post found with ID ${postId}` });

  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postId, postId));

  return res.json(comments);
};

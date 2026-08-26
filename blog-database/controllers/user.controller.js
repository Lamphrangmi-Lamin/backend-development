const { usersTable, postsTable } = require("../models/blog.model");
const db = require("../db/index");
const { eq } = require("drizzle-orm");

exports.createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || name.trim() === "")
    return res.status(400).json({ error: "Name is invalid" });

  if (!email || email.trim() === "")
    return res.status(400).json({ error: "Email is invalid" });

  const [newUser] = await db
    .insert(usersTable)
    .values({
      name,
      email,
    })
    .returning();

  return res
    .status(201)
    .json({ message: "New user created in DB", user: newUser });
};

exports.getAllUsers = async (req, res) => {
  const users = await db.select().from(usersTable);
  return res.json(users);
};

//  GET /users/:id/posts
exports.getAllPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (existingUser.length === 0)
      return res
        .status(404)
        .json({ error: `User with ID ${userId} does not exist` });

    const posts = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.authorId, userId));

    return res.json(posts);
    // ***
  } catch (error) {
    console.error("Error while fetching posts: ", error);
    return res
      .status(500)
      .json({ error: "Internal server error. Failed to fetch posts" });
  }
};

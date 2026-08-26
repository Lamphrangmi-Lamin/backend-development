const express = require("express");
const {
  createPost,
  getPostById,
  createCommentByPostId,
  getAllCommentsByPostId,
} = require("../controllers/post.controller");
const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPostById);
router.post("/:id/comments", createCommentByPostId);
router.get("/:id/comments", getAllCommentsByPostId);

module.exports = router;

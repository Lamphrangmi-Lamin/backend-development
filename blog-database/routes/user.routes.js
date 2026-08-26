const express = require("express");
const {
  createUser,
  getAllUsers,
  getAllPostsByUserId,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id/posts", getAllPostsByUserId);

module.exports = router;

const express = require("express");
const {
  getUsers,
  getUserById,
  updateEmailById,
  deleteUserById,
  createUser,
} = require("../controllers/user.controller");
const router = express.Router();

// ? GET /
router.get("/", getUsers);

// ? GET /:id
router.get("/:id", getUserById);

// ? POST /
router.post("/", createUser);

// ? PATCH /:id
router.patch("/:id", updateEmailById);

// ? DELETE /:id
router.delete("/:id", deleteUserById);

module.exports = router;

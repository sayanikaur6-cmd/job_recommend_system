const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} = require("../controllers/postController");

router.post("/", authMiddleware, createPost);

router.get("/", authMiddleware, getPosts);

router.put("/:postId", authMiddleware, updatePost);

router.delete("/:postId", authMiddleware, deletePost);

router.put("/like/:postId", authMiddleware, likePost);

router.post("/comment/:postId", authMiddleware, commentPost);

module.exports = router;
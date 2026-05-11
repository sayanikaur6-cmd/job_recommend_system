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
  replyComment,
  likeComment,
  likeReply,
} = require("../controllers/postController");

router.post("/", authMiddleware, createPost);

router.get("/", authMiddleware, getPosts);

router.put("/:postId", authMiddleware, updatePost);

router.delete("/:postId", authMiddleware, deletePost);

router.put("/like/:postId", authMiddleware, likePost);

router.post("/comment/:postId", authMiddleware, commentPost);
router.post(
  "/reply/:postId/:commentId",
  authMiddleware,
  replyComment
);

router.put(
  "/comment-like/:postId/:commentId",
  authMiddleware,
  likeComment
);

router.put(
  "/reply-like/:postId/:commentId/:replyId",
  authMiddleware,
  likeReply
);

module.exports = router;
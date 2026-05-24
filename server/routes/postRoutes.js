const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const uploadPostImage = require("../middleware/postUpload");

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
  getMyPosts,
} = require("../controllers/postController");

// CREATE POST
router.post(
  "/",
  authMiddleware,
  uploadPostImage.single("image"),
  createPost
);

// GET POSTS
router.get("/", authMiddleware, getPosts);

router.get(
 "/my-posts",
 authMiddleware,
 getMyPosts
);

// UPDATE POST
router.put(
  "/:postId",
  authMiddleware,
  uploadPostImage.single("image"),
  updatePost
);

// DELETE POST
router.delete("/:postId", authMiddleware, deletePost);

// LIKE POST
router.put("/like/:postId", authMiddleware, likePost);

// COMMENT
router.post("/comment/:postId", authMiddleware, commentPost);

// REPLY
router.post(
  "/reply/:postId/:commentId",
  authMiddleware,
  replyComment
);

// LIKE COMMENT
router.put(
  "/comment-like/:postId/:commentId",
  authMiddleware,
  likeComment
);

// LIKE REPLY
router.put(
  "/reply-like/:postId/:commentId/:replyId",
  authMiddleware,
  likeReply
);

module.exports = router;
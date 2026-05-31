const Post = require("../models/Post");

const getCurrentUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId;
};

const getPostId = (req) => {
  return req.params.postId || req.params.id;
};

const extractTags = (text = "") => {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  return matches.map((tag) => tag.replace("#", "").toLowerCase());
};

const parseJsonArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const populatePostQuery = (query) => {
  return query
    .populate("user", "_id name email profilePic")
    .populate("mentions", "_id name email profilePic")
    .populate("likes", "_id name")
    .populate("comments.user", "_id name email profilePic")
    .populate("comments.mentions", "_id name email profilePic")
    .populate("comments.likes", "_id name")
    .populate("comments.replies.user", "_id name email profilePic")
    .populate("comments.replies.mentions", "_id name email profilePic")
    .populate("comments.replies.likes", "_id name");
};

const formatPost = (post, currentUserId) => {
  const obj = post.toObject ? post.toObject() : post;

  obj.isOwner =
    obj.user?._id?.toString() === currentUserId?.toString();

  return obj;
};

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const { content = "", tags = "", mentionIds = "[]" } = req.body;

    const imagePath = req.file ? `/uploads/posts/${req.file.filename}` : "";

    if (!content.trim() && !imagePath) {
      return res.status(400).json({
        success: false,
        message: "Post content or image required",
      });
    }

    const autoTags = extractTags(content);

    const manualTags = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim().replace("#", "").toLowerCase())
          .filter(Boolean)
      : [];

    const mentions = parseJsonArray(mentionIds);

    const post = await Post.create({
      user: currentUserId,
      content,
      image: imagePath,
      tags: [...new Set([...autoTags, ...manualTags])],
      mentions,
    });

    const populatedPost = await populatePostQuery(Post.findById(post._id));

    res.status(201).json({
      success: true,
      post: formatPost(populatedPost, currentUserId),
    });
  } catch (error) {
    console.log("CREATE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Post create failed",
    });
  }
};

// GET ALL POSTS
exports.getPosts = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);

    const posts = await populatePostQuery(
      Post.find().sort({ createdAt: -1 })
    );

    const formattedPosts = posts.map((post) =>
      formatPost(post, currentUserId)
    );

    res.json({
      success: true,
      posts: formattedPosts,
    });
  } catch (error) {
    console.log("GET POSTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Posts fetch failed",
    });
  }
};

// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);
    const postId = getPostId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own post",
      });
    }

    const { content = "", tags = "", mentionIds = "[]" } = req.body;

    const imagePath = req.file ? `/uploads/posts/${req.file.filename}` : post.image;

    if (!content.trim() && !imagePath) {
      return res.status(400).json({
        success: false,
        message: "Post content or image required",
      });
    }

    const autoTags = extractTags(content);

    const manualTags = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim().replace("#", "").toLowerCase())
          .filter(Boolean)
      : post.tags || [];

    post.content = content;
    post.image = imagePath;
    post.tags = [...new Set([...autoTags, ...manualTags])];
    post.mentions = parseJsonArray(mentionIds);

    await post.save();

    const updatedPost = await populatePostQuery(Post.findById(post._id));

    res.json({
      success: true,
      post: formatPost(updatedPost, currentUserId),
    });
  } catch (error) {
    console.log("UPDATE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Post update failed",
    });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);
    const postId = getPostId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own post",
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("DELETE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Delete failed",
    });
  }
};

// LIKE / UNLIKE POST
exports.likePost = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);
    const postId = getPostId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === currentUserId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
    } else {
      post.likes.push(currentUserId);
    }

    await post.save();

    const updatedPost = await populatePostQuery(Post.findById(postId));

    res.json({
      success: true,
      post: formatPost(updatedPost, currentUserId),
    });
  } catch (error) {
    console.log("LIKE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Like failed",
    });
  }
};

// COMMENT POST
exports.commentPost = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);
    const postId = getPostId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const { text, mentionIds = [] } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: currentUserId,
      text,
      mentions: parseJsonArray(mentionIds),
    });

    await post.save();

    const updatedPost = await populatePostQuery(Post.findById(postId));

    res.json({
      success: true,
      post: formatPost(updatedPost, currentUserId),
    });
  } catch (error) {
    console.log("COMMENT POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Comment failed",
    });
  }
};

// REPLY COMMENT
exports.replyComment = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const { postId, commentId } = req.params;
    const { text, mentionIds = [] } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.replies.push({
      user: currentUserId,
      text,
      mentions: parseJsonArray(mentionIds),
    });

    await post.save();

    const updatedPost = await populatePostQuery(Post.findById(postId));

    res.json({
      success: true,
      post: formatPost(updatedPost, currentUserId),
    });
  } catch (error) {
    console.log("REPLY COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Reply failed",
    });
  }
};

// LIKE COMMENT
exports.likeComment = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === currentUserId.toString()
    );

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
    } else {
      comment.likes.push(currentUserId);
    }

    await post.save();

    const updatedPost = await populatePostQuery(Post.findById(postId));

    res.json({
      success: true,
      post: formatPost(updatedPost, currentUserId),
    });
  } catch (error) {
    console.log("LIKE COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Comment like failed",
    });
  }
};

// LIKE REPLY
exports.likeReply = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const { postId, commentId, replyId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    const alreadyLiked = reply.likes.some(
      (id) => id.toString() === currentUserId.toString()
    );

    if (alreadyLiked) {
      reply.likes = reply.likes.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
    } else {
      reply.likes.push(currentUserId);
    }

    await post.save();

    const updatedPost = await populatePostQuery(Post.findById(postId));

    res.json({
      success: true,
      post: formatPost(updatedPost, currentUserId),
    });
  } catch (error) {
    console.log("LIKE REPLY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Reply like failed",
    });
  }
<<<<<<< HEAD
=======
};

exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find({ user: userId })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
};
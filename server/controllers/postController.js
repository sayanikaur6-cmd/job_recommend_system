const Post = require("../models/Post");

// create post
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user.id,
      content: req.body.content,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user", "name profilePic");

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "_id name profilePic")
      .populate("comments.user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    post.content = req.body.content;
    await post.save();

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// like post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// comment
exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    post.comments.push({
      user: req.user.id,
      text: req.body.text,
    });

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("comments.user", "name profilePic");

    res.json({
      success: true,
      comments: updated.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const currentUserId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const ownerId = post.user?.toString();

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "Post owner not found",
      });
    }

    if (ownerId !== currentUserId.toString()) {
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
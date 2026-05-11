const Post = require("../models/Post");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const post = await Post.create({
      user: currentUserId,
      content: req.body.content,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user", "_id name email profilePic")
      .populate("comments.user", "_id name email profilePic");

    res.status(201).json({
      success: true,
      post: {
        ...populatedPost.toObject(),
        isOwner: true,
      },
    });
  } catch (error) {
    console.log("CREATE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL POSTS
exports.getPosts = async (req, res) => {
  try {
    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

    const posts = await Post.find()
      .populate("user", "_id name email profilePic")
      .populate("comments.user", "_id name email profilePic")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => {
      const obj = post.toObject();

      obj.isOwner =
        obj.user?._id?.toString() === currentUserId?.toString();

      return obj;
    });

    res.json({
      success: true,
      posts: formattedPosts,
    });
  } catch (error) {
    console.log("GET POSTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const post = await Post.findById(req.params.postId);

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

    post.content = req.body.content;
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "_id name email profilePic")
      .populate("comments.user", "_id name email profilePic");

    res.json({
      success: true,
      post: {
        ...updatedPost.toObject(),
        isOwner: true,
      },
    });
  } catch (error) {
    console.log("UPDATE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

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
      message: error.message,
    });
  }
};

// LIKE / UNLIKE POST
exports.likePost = async (req, res) => {
  try {
    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const post = await Post.findById(req.params.postId);

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

    const updatedPost = await Post.findById(post._id)
      .populate("user", "_id name email profilePic")
      .populate("comments.user", "_id name email profilePic");

    res.json({
      success: true,
      post: {
        ...updatedPost.toObject(),
        isOwner:
          updatedPost.user?._id?.toString() === currentUserId.toString(),
      },
    });
  } catch (error) {
    console.log("LIKE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// COMMENT POST
exports.commentPost = async (req, res) => {
  try {
    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: currentUserId,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "_id name email profilePic")
      .populate("comments.user", "_id name email profilePic");

    res.json({
      success: true,
      post: {
        ...updatedPost.toObject(),
        isOwner:
          updatedPost.user?._id?.toString() === currentUserId.toString(),
      },
    });
  } catch (error) {
    console.log("COMMENT POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// REPLY COMMENT
exports.replyComment = async (req, res) => {
  try {
    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

    const { postId, commentId } = req.params;
    const { text } = req.body;

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
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "_id name profilePic")
      .populate("comments.user", "_id name profilePic")
      .populate("comments.replies.user", "_id name profilePic");

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIKE COMMENT
exports.likeComment = async (req, res) => {
  try {
    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    const comment = post.comments.id(commentId);

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

    const updatedPost = await Post.findById(post._id)
      .populate("user", "_id name profilePic")
      .populate("comments.user", "_id name profilePic")
      .populate("comments.replies.user", "_id name profilePic");

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIKE REPLY
exports.likeReply = async (req, res) => {
  try {
    const currentUserId =
      req.user?.id || req.user?._id || req.user?.userId;

    const { postId, commentId, replyId } = req.params;

    const post = await Post.findById(postId);

    const comment = post.comments.id(commentId);

    const reply = comment.replies.id(replyId);

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

    const updatedPost = await Post.findById(post._id)
      .populate("user", "_id name profilePic")
      .populate("comments.user", "_id name profilePic")
      .populate("comments.replies.user", "_id name profilePic");

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
import { useEffect, useState } from "react";
import {
  getPosts,
  createPost,
  deletePost,
  likePost,
  commentPost,
} from "../api/postApi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const loadPosts = async () => {
    const data = await getPosts();
    setPosts(data.posts || []);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async () => {
    if (!content.trim()) return;

    setLoading(true);
    await createPost(content);
    setContent("");
    await loadPosts();
    setLoading(false);
  };

  const handleDelete = async (id) => {
  try {
    const ok = window.confirm(
      "Delete this post?"
    );

    if (!ok) return;

    await deletePost(id);

    setPosts((prev) =>
      prev.filter((p) => p._id !== id)
    );
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Delete failed"
    );
  }
};

  const handleLike = async (id) => {
    await likePost(id);
    loadPosts();
  };

  const handleComment = async (id, text) => {
    if (!text.trim()) return;
    await commentPost(id, text);
    loadPosts();
  };

  return (
    <div className="feed-page">
      <style>{`
        .feed-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef4ff, #f8fbff);
          padding: 35px 0;
        }

        .feed-container {
          max-width: 820px;
          margin: auto;
        }

        .glass-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 12px 35px rgba(13,110,253,0.08);
        }

        .create-box textarea {
          border-radius: 18px;
          resize: none;
          padding: 18px;
          background: #f8faff;
        }

        .post-card {
          animation: fadeUp 0.35s ease both;
          transition: 0.25s ease;
          overflow: hidden;
        }

        .post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 45px rgba(0,0,0,0.12);
        }

        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          background: #fff;
        }

        .post-content {
          font-size: 16px;
          line-height: 1.7;
          color: #222;
          white-space: pre-wrap;
        }

        .action-btn {
          border: none;
          background: #f3f6ff;
          padding: 9px 18px;
          border-radius: 999px;
          transition: 0.2s;
          font-weight: 600;
        }

        .action-btn:hover {
          background: #e7efff;
          transform: scale(1.04);
        }

        .comment-box input {
          border-radius: 999px;
          padding: 12px 18px;
          background: #f8faff;
        }

        .comment-item {
          background: #f5f7fb;
          border-radius: 16px;
          padding: 10px 14px;
        }

        .delete-btn {
          border-radius: 999px;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="feed-container px-3">
        <div className="glass-card create-box p-4 mb-4">
          <h4 className="fw-bold mb-3">Share something with your network</h4>

          <textarea
            className="form-control border-0 shadow-sm mb-3"
            rows="4"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {content.length}/500 characters
            </small>

            <button
              className="btn btn-primary px-5 rounded-pill"
              onClick={handleCreate}
              disabled={loading || !content.trim()}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={user}
            onDelete={handleDelete}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
};

const PostCard = ({ post, currentUser, onDelete, onLike, onComment }) => {
  const [comment, setComment] = useState("");

  const currentUserId =
    currentUser?.id || currentUser?._id || currentUser?.userId;

  const isOwner = currentUserId?.toString() === post.user?._id?.toString();

  const userImage = post.user?.profilePic
    ? post.user.profilePic.startsWith("http")
      ? post.user.profilePic
      : `${API}${post.user.profilePic}`
    : "https://ui-avatars.com/api/?name=User&background=0d6efd&color=fff";

  return (
    <div className="glass-card post-card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex gap-3 align-items-center">
          <img src={userImage} alt="" className="avatar" />

          <div>
            <h6 className="fw-bold mb-0">
              {post.user?.name || "Unknown User"}
            </h6>

            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              {new Date(post.createdAt).toLocaleString()}
              {post.updatedAt !== post.createdAt && " • Edited"}
            </small>
          </div>
        </div>

        {isOwner && (
          <button
            className="btn btn-outline-danger btn-sm delete-btn"
            onClick={() => onDelete(post._id)}
          >
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        )}
      </div>

      <p className="post-content mt-4 mb-3">{post.content}</p>

      <div className="d-flex gap-2 border-top border-bottom py-2">
        <button className="action-btn" onClick={() => onLike(post._id)}>
          ❤️ {post.likes?.length || 0} Like
        </button>

        <button className="action-btn">
          💬 {post.comments?.length || 0} Comment
        </button>
      </div>

      <div className="mt-3 comment-box">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control border-0 shadow-sm"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onComment(post._id, comment);
                setComment("");
              }
            }}
          />

          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => {
              onComment(post._id, comment);
              setComment("");
            }}
          >
            Send
          </button>
        </div>

        <div className="mt-3">
          {(post.comments || []).map((c) => (
            <div className="comment-item mb-2" key={c._id}>
              <strong>{c.user?.name || "User"}</strong>
              <p className="mb-0 small">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;

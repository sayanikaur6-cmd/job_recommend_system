import { useEffect, useRef, useState } from "react";
import {
  getPosts,
  createPost,
  deletePost,
  likePost,
  commentPost,
  replyComment,
  likeComment,
  likeReply,
} from "../api/postApi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");
  const [mentionIds, setMentionIds] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setPosts([]);
        return;
      }

      const data = await getPosts();

      console.log("POSTS FROM API:", data);

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("GET POSTS ERROR:", error.response?.data || error.message);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const addMentionText = () => {
    if (!mentionInput.trim()) return;

    const name = mentionInput.trim();

    if (!content.includes(`@${name}`)) {
      setContent((prev) => `${prev} @${name}`);
    }

    setMentionInput("");
  };

  const handleCreate = async () => {
    if (!content.trim() && !image) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      formData.append("tags", tagInput);
      formData.append("mentionIds", JSON.stringify(mentionIds));

      if (image) {
        formData.append("image", image);
      }

      await createPost(formData);
      await loadPosts();

      setContent("");
      setTagInput("");
      setMentionInput("");
      setMentionIds([]);
      removeImage();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Post create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const ok = window.confirm("Delete this post?");
      if (!ok) return;

      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleLike = async (id) => {
    try {
      const updatedPost = await likePost(id);

      setPosts((prev) =>
        prev.map((post) => (post._id === id ? updatedPost : post))
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleComment = async (id, text) => {
    if (!text.trim()) return;

    try {
      const updatedPost = await commentPost(id, {
        text,
        mentionIds: [],
      });

      setPosts((prev) =>
        prev.map((post) => (post._id === id ? updatedPost : post))
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
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

        .post-image {
          width: 100%;
          max-height: 460px;
          object-fit: cover;
          border-radius: 22px;
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

        .reply-item {
          background: #ffffff;
          border-radius: 14px;
          padding: 9px 12px;
          border: 1px solid #edf1ff;
        }

        .delete-btn {
          border-radius: 999px;
        }

        .tag-badge {
          background: #eef2ff;
          color: #6366f1;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .mention-badge {
          background: #e0f2fe;
          color: #0369a1;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
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
            maxLength="500"
            placeholder="What's on your mind? Use #tag and @mention"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {preview && (
            <div className="position-relative mb-3">
              <img src={preview} alt="Preview" className="post-image" />

              <button
                className="btn btn-danger btn-sm position-absolute"
                style={{
                  top: "10px",
                  right: "10px",
                  borderRadius: "50%",
                }}
                onClick={removeImage}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          )}

          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Add tags: react, job, hiring"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-md-6 d-flex gap-2">
              <input
                className="form-control"
                placeholder="Mention name: Rahul"
                value={mentionInput}
                onChange={(e) => setMentionInput(e.target.value)}
                style={{ borderRadius: "14px" }}
              />

              <button
                className="btn btn-outline-primary"
                style={{ borderRadius: "14px" }}
                onClick={addMentionText}
              >
                @
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <small className="text-muted">{content.length}/500 characters</small>

              <button
                className="btn btn-light border d-flex align-items-center gap-2"
                onClick={() => fileRef.current.click()}
                style={{ borderRadius: "999px" }}
              >
                <i className="bi bi-image"></i>
                Photo
              </button>

              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            <button
              className="btn btn-primary px-5 rounded-pill"
              onClick={handleCreate}
              disabled={loading || (!content.trim() && !image)}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {posts.length === 0 && (
          <div className="glass-card p-4 text-center text-muted">
            No posts found
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={user}
            onDelete={handleDelete}
            onLike={handleLike}
            onComment={handleComment}
            reload={loadPosts}
          />
        ))}
      </div>
    </div>
  );
};

const PostCard = ({ post, currentUser, onDelete, onLike, onComment, reload }) => {
  const [comment, setComment] = useState("");

  const userImage = post.user?.profilePic
    ? post.user.profilePic.startsWith("http")
      ? post.user.profilePic
      : `${API}${post.user.profilePic}`
    : `https://ui-avatars.com/api/?name=${post.user?.name || "User"}&background=0d6efd&color=fff`;

  const postImage = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `${API}${post.image}`
    : "";

  return (
    <div className="glass-card post-card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex gap-3 align-items-center">
          <img src={userImage} alt="" className="avatar" />

          <div>
            <h6 className="fw-bold mb-0">{post.user?.name || "Unknown User"}</h6>

            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              {new Date(post.createdAt).toLocaleString()}
              {post.updatedAt !== post.createdAt && " • Edited"}
            </small>
          </div>
        </div>

        {post.isOwner && (
          <button
            className="btn btn-outline-danger btn-sm delete-btn"
            onClick={() => onDelete(post._id)}
          >
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        )}
      </div>

      {post.content && (
        <p className="post-content mt-4 mb-3">{post.content}</p>
      )}

      {post.tags?.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag-badge">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {post.mentions?.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          {post.mentions.map((u) => (
            <span key={u._id} className="mention-badge">
              @{u.name}
            </span>
          ))}
        </div>
      )}

      {postImage && (
        <img src={postImage} alt="Post" className="post-image mb-3" />
      )}

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
            <CommentCard
              key={c._id}
              comment={c}
              postId={post._id}
              reload={reload}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CommentCard = ({ comment, postId, reload }) => {
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleReply = async () => {
    if (!reply.trim()) return;

    await replyComment(postId, comment._id, {
      text: reply,
      mentionIds: [],
    });

    setReply("");
    setShowReply(false);
    reload();
  };

  const handleLikeComment = async () => {
    await likeComment(postId, comment._id);
    reload();
  };

  const handleLikeReply = async (replyId) => {
    await likeReply(postId, comment._id, replyId);
    reload();
  };

  return (
    <div className="mb-3">
      <div className="comment-item">
        <strong>{comment.user?.name || "User"}</strong>

        <p className="mb-1 mt-1 small">{comment.text}</p>

        {comment.mentions?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-1">
            {comment.mentions.map((u) => (
              <span key={u._id} className="mention-badge">
                @{u.name}
              </span>
            ))}
          </div>
        )}

        <div className="d-flex gap-3 mt-2">
          <button
            className="btn btn-sm btn-link p-0 text-decoration-none"
            onClick={handleLikeComment}
          >
            ❤️ {comment.likes?.length || 0}
          </button>

          <button
            className="btn btn-sm btn-link p-0 text-decoration-none"
            onClick={() => setShowReply(!showReply)}
          >
            Reply
          </button>
        </div>
      </div>

      {showReply && (
        <div className="d-flex gap-2 mt-2 ms-4">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={`Reply to ${comment.user?.name || "User"}...`}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleReply();
            }}
          />

          <button className="btn btn-sm btn-primary" onClick={handleReply}>
            Send
          </button>
        </div>
      )}

      <div className="ms-4 mt-2">
        {(comment.replies || []).map((r) => (
          <div className="reply-item mb-2" key={r._id}>
            <strong>{r.user?.name || "User"}</strong>

            <p className="mb-1 mt-1 small">{r.text}</p>

            {r.mentions?.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-1">
                {r.mentions.map((u) => (
                  <span key={u._id} className="mention-badge">
                    @{u.name}
                  </span>
                ))}
              </div>
            )}

            <button
              className="btn btn-sm btn-link p-0 text-decoration-none"
              onClick={() => handleLikeReply(r._id)}
            >
              ❤️ {r.likes?.length || 0}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
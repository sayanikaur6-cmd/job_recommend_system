import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPosts,
  getUserPosts, // Ensure your postApi exported this, or update to your endpoint
  createPost,
  deletePost,
  likePost,
  commentPost,
  replyComment,
  likeComment,
  likeReply,
} from "../api/postApi";
import { searchUsers } from "../api/userApi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getProfileImage = (u) => {
  if (u?.profilePic) {
    return u.profilePic.startsWith("http")
      ? u.profilePic
      : `${API}${u.profilePic}`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    u?.name || "User"
  )}&background=111827&color=fff`;
};

const ProfileFeed = ({ userId, isOwnProfile = false }) => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");
  const [mentionIds, setMentionIds] = useState([]);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentionBox, setShowMentionBox] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  const fileRef = useRef(null);
  const mentionTimer = useRef(null);

  const openProfile = (targetUserId) => {
    if (!targetUserId || targetUserId === userId) return;
    navigate("/profile", {
      state: { viewOnly: true, profileUserId: targetUserId },
    });
  };

  const loadPosts = async () => {
    try {
      setFetchingPosts(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setPosts([]);
        return;
      }

      // Fetch user-specific posts if userId is provided, else fallback
      let data;
      if (userId && typeof getUserPosts === "function") {
        data = await getUserPosts(userId);
      } else {
        data = await getPosts();
      }

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET PROFILE POSTS ERROR:", error.response?.data || error.message);
      setPosts([]);
    } finally {
      setFetchingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const handleMentionSearch = (value) => {
    setMentionInput(value);
    if (mentionTimer.current) clearTimeout(mentionTimer.current);

    if (value.trim().length < 1) {
      setMentionSuggestions([]);
      setShowMentionBox(false);
      return;
    }

    mentionTimer.current = setTimeout(async () => {
      try {
        const users = await searchUsers(value.trim());
        setMentionSuggestions(users || []);
        setShowMentionBox(true);
      } catch (error) {
        console.error("MENTION SEARCH ERROR:", error.response?.data || error.message);
        setMentionSuggestions([]);
        setShowMentionBox(false);
      }
    }, 250);
  };

  const selectMention = (u) => {
    if (!u?._id) return;

    const mentionText = `@${u.name}`;

    setContent((prev) => {
      const cleanPrev = prev.trim();
      if (cleanPrev.includes(mentionText)) return cleanPrev;
      return `${cleanPrev} ${mentionText}`.trim();
    });

    setMentionIds((prev) => (prev.includes(u._id) ? prev : [...prev, u._id]));

    setMentionInput("");
    setMentionSuggestions([]);
    setShowMentionBox(false);
  };

  const addMentionText = () => {
    if (!mentionInput.trim()) return;

    const name = mentionInput.trim();
    if (!content.includes(`@${name}`)) {
      setContent((prev) => `${prev} @${name}`.trim());
    }

    setMentionInput("");
    setMentionSuggestions([]);
    setShowMentionBox(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCreate = async () => {
    if (!content.trim() && !image) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      formData.append("tags", tagInput);
      formData.append("mentionIds", JSON.stringify(mentionIds));
      if (image) formData.append("image", image);

      await createPost(formData);
      await loadPosts();

      setContent("");
      setTagInput("");
      setMentionInput("");
      setMentionIds([]);
      setMentionSuggestions([]);
      setShowMentionBox(false);
      removeImage();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create post");
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
      setPosts((prev) => prev.map((post) => (post._id === id ? updatedPost : post)));
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleComment = async (id, text) => {
    if (!text.trim()) return;

    try {
      const updatedPost = await commentPost(id, {
        text,
        mentionIds: [],
      });

      setPosts((prev) => prev.map((post) => (post._id === id ? updatedPost : post)));
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="profile-feed-wrapper">
      <style>{`
        .profile-feed-wrapper {
          width: 100%;
        }

        .premium-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          box-shadow: 0 16px 45px rgba(30, 64, 175, 0.08);
        }

        .composer {
          padding: 24px;
          position: relative;
          overflow: visible;
        }

        .composer textarea {
          border: 0;
          border-radius: 18px;
          resize: none;
          padding: 16px;
          background: rgba(248, 250, 252, 0.95);
          box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.8);
          font-size: 15px;
        }

        .composer textarea:focus,
        .premium-input:focus {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), inset 0 0 0 1px #60a5fa;
          outline: none;
        }

        .premium-input {
          border: 0;
          border-radius: 16px;
          padding: 12px 16px;
          background: rgba(248, 250, 252, 0.96);
          box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.9);
        }

        .post-card {
          padding: 24px;
          margin-bottom: 22px;
          transition: all 0.25s ease;
          position: relative;
        }

        .post-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
        }

        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          object-fit: cover;
          border: 3px solid #fff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
          cursor: pointer;
        }

        .avatar-sm {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid #fff;
          cursor: pointer;
          flex-shrink: 0;
        }

        .click-name {
          cursor: pointer;
          transition: 0.2s;
        }

        .click-name:hover {
          color: #2563eb;
        }

        .post-meta {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 600;
        }

        .post-content {
          font-size: 15px;
          line-height: 1.7;
          color: #1f2937;
          white-space: pre-wrap;
          margin-top: 16px;
        }

        .post-image {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
        }

        .preview-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
        }

        .remove-img {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 0;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          display: grid;
          place-items: center;
        }

        .tag-badge,
        .mention-badge {
          border: 0;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .tag-badge {
          background: #eef2ff;
          color: #4f46e5;
        }

        .mention-badge {
          background: #e0f2fe;
          color: #0369a1;
          cursor: pointer;
        }

        .action-bar {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding-top: 14px;
          margin-top: 16px;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
        }

        .action-btn {
          border: 0;
          background: rgba(248, 250, 252, 0.95);
          padding: 10px 16px;
          border-radius: 14px;
          transition: 0.2s ease;
          font-weight: 800;
          color: #334155;
        }

        .action-btn:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        .premium-btn {
          border: 0;
          border-radius: 999px;
          padding: 10px 24px;
          font-weight: 800;
          color: white;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          box-shadow: 0 10px 22px rgba(37, 99, 235, 0.25);
          transition: 0.25s;
        }

        .premium-btn:disabled {
          opacity: 0.55;
        }

        .soft-btn {
          border: 0;
          border-radius: 999px;
          padding: 9px 15px;
          background: rgba(255, 255, 255, 0.85);
          color: #334155;
          font-weight: 700;
          box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.9);
        }

        .delete-btn {
          border-radius: 999px;
          font-weight: 700;
          border: 1px solid #fecaca;
          color: #dc2626;
          background: #fff1f2;
        }

        .comment-box {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
        }

        .comment-input {
          border: 0;
          border-radius: 999px;
          padding: 11px 16px;
          background: rgba(248, 250, 252, 0.96);
          box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.9);
        }

        .comment-item {
          background: rgba(248, 250, 252, 0.95);
          border-radius: 18px;
          padding: 12px;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }

        .reply-item {
          background: #ffffff;
          border-radius: 16px;
          padding: 10px;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }

        .mini-link {
          border: 0;
          background: transparent;
          padding: 0;
          font-weight: 700;
          color: #64748b;
          font-size: 12px;
        }

        .mini-link:hover {
          color: #2563eb;
        }

        .mention-dropdown {
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          z-index: 999;
          background: rgba(255, 255, 255, 0.98);
          border-radius: 18px;
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.15);
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 8px;
          max-height: 220px;
          overflow-y: auto;
        }

        .mention-option {
          cursor: pointer;
          border-radius: 12px;
          padding: 8px;
        }

        .mention-option:hover {
          background: #eff6ff;
        }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #64748b;
          font-weight: 700;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 20px;
          margin: 0 auto 12px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          font-size: 26px;
        }
      `}</style>

      {/* Composer only rendered on own profile */}
      {isOwnProfile && (
        <div className="premium-card composer mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0">Create Profile Post</h5>
              <small className="text-muted">Share updates on your timeline</small>
            </div>
          </div>

          <textarea
            className="form-control mb-3"
            rows="3"
            maxLength="500"
            placeholder="Share an update or project..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {preview && (
            <div className="preview-wrap mb-3">
              <img src={preview} alt="Preview" className="post-image" />
              <button className="remove-img" onClick={removeImage}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          )}

          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <input
                className="form-control premium-input"
                placeholder="Tags: react, portfolio"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
            </div>

            <div className="col-md-6 d-flex gap-2">
              <div className="position-relative flex-grow-1">
                <input
                  className="form-control premium-input"
                  placeholder="Mention user..."
                  value={mentionInput}
                  onChange={(e) => handleMentionSearch(e.target.value)}
                  onFocus={() => {
                    if (mentionInput.trim()) setShowMentionBox(true);
                  }}
                />

                {showMentionBox && mentionInput.trim() && (
                  <div className="mention-dropdown">
                    {mentionSuggestions.length > 0 ? (
                      mentionSuggestions.map((u) => (
                        <div
                          key={u._id}
                          className="mention-option d-flex align-items-center gap-2"
                          onMouseDown={() => selectMention(u)}
                        >
                          <img src={getProfileImage(u)} className="avatar-sm" alt="" />
                          <div>
                            <div className="fw-bold small">{u.name}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted small">No user found</div>
                    )}
                  </div>
                )}
              </div>

              <button className="soft-btn" onClick={addMentionText}>
                @
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <button className="soft-btn" onClick={() => fileRef.current.click()}>
                <i className="bi bi-image me-1"></i> Add Photo
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
              className="premium-btn"
              onClick={handleCreate}
              disabled={loading || (!content.trim() && !image)}
            >
              {loading ? "Posting..." : "Publish Post"}
            </button>
          </div>
        </div>
      )}

      {/* Feed List State Handling */}
      {fetchingPosts ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="premium-card empty-state">
          <div className="empty-icon">
            <i className="bi bi-journal-text"></i>
          </div>
          No posts shared yet.
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={handleDelete}
            onLike={handleLike}
            onComment={handleComment}
            reload={loadPosts}
            openProfile={openProfile}
          />
        ))
      )}
    </div>
  );
};

const PostCard = ({ post, onDelete, onLike, onComment, reload, openProfile }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const userImage = getProfileImage(post.user);
  const postImage = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `${API}${post.image}`
    : "";

  return (
    <div className="premium-card post-card">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="d-flex gap-3 align-items-center">
          <img
            src={userImage}
            alt=""
            className="avatar"
            onClick={() => openProfile(post.user?._id)}
          />

          <div>
            <h6
              className="fw-bold mb-0 click-name"
              onClick={() => openProfile(post.user?._id)}
            >
              {post.user?.name || "Unknown User"}
            </h6>

            <div className="post-meta">
              <i className="bi bi-clock me-1"></i>
              {new Date(post.createdAt).toLocaleDateString()}
              {post.updatedAt !== post.createdAt && " • Edited"}
            </div>
          </div>
        </div>

        {post.isOwner && (
          <button className="btn btn-sm delete-btn" onClick={() => onDelete(post._id)}>
            <i className="bi bi-trash me-1"></i> Delete
          </button>
        )}
      </div>

      {post.content && <p className="post-content mb-3">{post.content}</p>}

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
            <button
              key={u._id}
              type="button"
              className="mention-badge"
              onClick={() => openProfile(u._id)}
            >
              @{u.name}
            </button>
          ))}
        </div>
      )}

      {postImage && <img src={postImage} alt="Post" className="post-image mb-3" />}

      <div className="action-bar">
        <button className="action-btn" onClick={() => onLike(post._id)}>
          ❤️ {post.likes?.length || 0} Like
        </button>

        <button className="action-btn" onClick={() => setShowComments((prev) => !prev)}>
          💬 {post.comments?.length || 0} Comment
        </button>
      </div>

      {showComments && (
        <div className="comment-box">
          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control comment-input"
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
              className="premium-btn px-3"
              onClick={() => {
                onComment(post._id, comment);
                setComment("");
              }}
            >
              Send
            </button>
          </div>

          <div>
            {(post.comments || []).map((c) => (
              <CommentCard
                key={c._id}
                comment={c}
                postId={post._id}
                reload={reload}
                openProfile={openProfile}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CommentCard = ({ comment, postId, reload, openProfile }) => {
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
      <div className="comment-item d-flex gap-2">
        <img
          src={getProfileImage(comment.user)}
          className="avatar-sm"
          alt=""
          onClick={() => openProfile(comment.user?._id)}
        />

        <div className="flex-grow-1">
          <strong className="click-name small" onClick={() => openProfile(comment.user?._id)}>
            {comment.user?.name || "User"}
          </strong>

          <p className="mb-1 mt-1 small">{comment.text}</p>

          <div className="d-flex gap-3 mt-1">
            <button className="mini-link" onClick={handleLikeComment}>
              ❤️ {comment.likes?.length || 0}
            </button>

            <button className="mini-link" onClick={() => setShowReply(!showReply)}>
              Reply
            </button>
          </div>
        </div>
      </div>

      {showReply && (
        <div className="d-flex gap-2 mt-2 ms-4">
          <input
            type="text"
            className="form-control comment-input"
            placeholder={`Reply to ${comment.user?.name || "User"}...`}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleReply();
            }}
          />

          <button className="premium-btn px-3" onClick={handleReply}>
            Send
          </button>
        </div>
      )}

      <div className="ms-4 mt-2">
        {(comment.replies || []).map((r) => (
          <div className="reply-item mb-2 d-flex gap-2" key={r._id}>
            <img
              src={getProfileImage(r.user)}
              className="avatar-sm"
              alt=""
              onClick={() => openProfile(r.user?._id)}
            />

            <div className="flex-grow-1">
              <strong className="click-name small" onClick={() => openProfile(r.user?._id)}>
                {r.user?.name || "User"}
              </strong>

              <p className="mb-1 mt-1 small">{r.text}</p>

              <button className="mini-link" onClick={() => handleLikeReply(r._id)}>
                ❤️ {r.likes?.length || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileFeed;
import { useEffect, useRef, useState } from "react";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
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
<<<<<<< HEAD

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Feed = () => {
=======
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

const Feed = () => {
  const navigate = useNavigate();

>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");
  const [mentionIds, setMentionIds] = useState([]);
<<<<<<< HEAD
=======
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentionBox, setShowMentionBox] = useState(false);
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);
<<<<<<< HEAD

  const user = JSON.parse(localStorage.getItem("user")) || {};
=======
  const mentionTimer = useRef(null);

  const openProfile = (userId) => {
    if (!userId) return;
    navigate("/profile", {
      state: { viewOnly: true, profileUserId: userId },
    });
  };
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem("token");
<<<<<<< HEAD

      if (!token) {
        console.log("No token found");
=======
      if (!token) {
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
        setPosts([]);
        return;
      }

      const data = await getPosts();
<<<<<<< HEAD

      console.log("POSTS FROM API:", data);

=======
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("GET POSTS ERROR:", error.response?.data || error.message);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

<<<<<<< HEAD
=======
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
        console.log("MENTION SEARCH ERROR:", error.response?.data || error.message);
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

>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
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

<<<<<<< HEAD
  const addMentionText = () => {
    if (!mentionInput.trim()) return;

    const name = mentionInput.trim();

    if (!content.includes(`@${name}`)) {
      setContent((prev) => `${prev} @${name}`);
    }

    setMentionInput("");
  };

=======
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
  const handleCreate = async () => {
    if (!content.trim() && !image) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      formData.append("tags", tagInput);
      formData.append("mentionIds", JSON.stringify(mentionIds));
<<<<<<< HEAD

      if (image) {
        formData.append("image", image);
      }
=======
      if (image) formData.append("image", image);
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59

      await createPost(formData);
      await loadPosts();

      setContent("");
      setTagInput("");
      setMentionInput("");
      setMentionIds([]);
<<<<<<< HEAD
      removeImage();
    } catch (error) {
      console.log(error);
=======
      setMentionSuggestions([]);
      setShowMentionBox(false);
      removeImage();
    } catch (error) {
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
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
<<<<<<< HEAD

      setPosts((prev) =>
        prev.map((post) => (post._id === id ? updatedPost : post))
      );
=======
      setPosts((prev) => prev.map((post) => (post._id === id ? updatedPost : post)));
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
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

<<<<<<< HEAD
      setPosts((prev) =>
        prev.map((post) => (post._id === id ? updatedPost : post))
      );
=======
      setPosts((prev) => prev.map((post) => (post._id === id ? updatedPost : post)));
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="feed-page">
      <style>{`
        .feed-page {
          min-height: 100vh;
<<<<<<< HEAD
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
=======
          padding: 42px 0;
          background:
            radial-gradient(circle at top left, rgba(99,102,241,.28), transparent 32%),
            radial-gradient(circle at top right, rgba(14,165,233,.25), transparent 34%),
            linear-gradient(135deg, #eef2ff 0%, #f8fbff 45%, #fff7ed 100%);
          position: relative;
          overflow-x: hidden;
        }

        .feed-page::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.55) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.55) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        .feed-container {
          width: min(920px, 100%);
          margin: auto;
          position: relative;
          z-index: 2;
        }

        .hero-title {
          background: linear-gradient(135deg, #111827, #2563eb, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          color: #64748b;
          font-weight: 500;
        }

        .premium-card {
          background: rgba(255,255,255,.78);
          backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 30px;
          box-shadow:
            0 22px 70px rgba(30,64,175,.12),
            inset 0 1px 0 rgba(255,255,255,.9);
        }

        .composer {
          padding: 26px;
          position: relative;
          overflow: visible;
        }

        .composer::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 30px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(37,99,235,.35), rgba(168,85,247,.35), rgba(14,165,233,.35));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .composer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .composer-pill {
          padding: 8px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff, #f5f3ff);
          color: #2563eb;
          font-weight: 800;
          font-size: 13px;
          border: 1px solid #dbeafe;
        }

        .composer textarea {
          border: 0;
          border-radius: 24px;
          resize: none;
          padding: 20px;
          background: rgba(248,250,252,.95);
          box-shadow: inset 0 0 0 1px rgba(226,232,240,.8);
          font-size: 16px;
          line-height: 1.7;
        }

        .composer textarea:focus,
        .premium-input:focus {
          box-shadow: 0 0 0 4px rgba(59,130,246,.12), inset 0 0 0 1px #60a5fa;
          outline: none;
        }

        .premium-input {
          border: 0;
          border-radius: 18px;
          padding: 13px 16px;
          background: rgba(248,250,252,.96);
          box-shadow: inset 0 0 0 1px rgba(226,232,240,.9);
        }

        .post-card {
          padding: 26px;
          margin-bottom: 26px;
          animation: fadeUp .38s ease both;
          transition: .28s ease;
          overflow: hidden;
          position: relative;
        }

        .post-card::after {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,.13), transparent 70%);
          top: -70px;
          right: -70px;
          pointer-events: none;
        }

        .post-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 28px 85px rgba(15,23,42,.14),
            inset 0 1px 0 rgba(255,255,255,.95);
        }

        .avatar {
          width: 58px;
          height: 58px;
          border-radius: 20px;
          object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 10px 25px rgba(15,23,42,.18);
          cursor: pointer;
          background: #fff;
        }

        .avatar-sm {
          width: 39px;
          height: 39px;
          border-radius: 14px;
          object-fit: cover;
          border: 2px solid #fff;
          box-shadow: 0 5px 14px rgba(15,23,42,.13);
          cursor: pointer;
          background: #fff;
          flex-shrink: 0;
        }

        .click-name {
          cursor: pointer;
          transition: .2s;
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
          font-size: 16px;
          line-height: 1.8;
          color: #1f2937;
          white-space: pre-wrap;
          margin-top: 22px;
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
        }

        .post-image {
          width: 100%;
<<<<<<< HEAD
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
=======
          max-height: 520px;
          object-fit: cover;
          border-radius: 26px;
          box-shadow: 0 18px 45px rgba(15,23,42,.14);
          border: 1px solid rgba(255,255,255,.8);
        }

        .preview-wrap {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
        }

        .remove-img {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 0;
          background: rgba(220,38,38,.95);
          color: white;
          display: grid;
          place-items: center;
          box-shadow: 0 10px 25px rgba(220,38,38,.35);
        }

        .tag-badge,
        .mention-badge {
          border: 0;
          padding: 8px 13px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
        }

        .tag-badge {
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          color: #4f46e5;
        }

        .mention-badge {
          background: linear-gradient(135deg, #e0f2fe, #dbeafe);
          color: #0369a1;
          cursor: pointer;
        }

        .mention-badge:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #bae6fd, #bfdbfe);
        }

        .action-bar {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding-top: 16px;
          margin-top: 18px;
          border-top: 1px solid rgba(226,232,240,.9);
        }

        .action-btn {
          border: 0;
          background: rgba(248,250,252,.95);
          padding: 12px 18px;
          border-radius: 18px;
          transition: .2s ease;
          font-weight: 900;
          color: #334155;
          box-shadow: inset 0 0 0 1px rgba(226,232,240,.9);
        }

        .action-btn:hover {
          background: linear-gradient(135deg, #eff6ff, #f5f3ff);
          color: #2563eb;
          transform: translateY(-2px);
        }

        .premium-btn {
          border: 0;
          border-radius: 999px;
          padding: 12px 28px;
          font-weight: 900;
          color: white;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          box-shadow: 0 14px 28px rgba(37,99,235,.28);
          transition: .25s;
        }

        .premium-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 35px rgba(37,99,235,.35);
        }

        .premium-btn:disabled {
          opacity: .55;
          transform: none;
        }

        .soft-btn {
          border: 0;
          border-radius: 999px;
          padding: 11px 17px;
          background: rgba(255,255,255,.85);
          color: #334155;
          font-weight: 800;
          box-shadow: inset 0 0 0 1px rgba(226,232,240,.9);
        }

        .soft-btn:hover {
          background: #eff6ff;
          color: #2563eb;
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
        }

        .delete-btn {
          border-radius: 999px;
<<<<<<< HEAD
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
=======
          font-weight: 800;
          border: 1px solid #fecaca;
          color: #dc2626;
          background: #fff1f2;
        }

        .delete-btn:hover {
          background: #dc2626;
          color: white;
        }

        .comment-box {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(226,232,240,.8);
        }

        .comment-input {
          border: 0;
          border-radius: 999px;
          padding: 13px 18px;
          background: rgba(248,250,252,.96);
          box-shadow: inset 0 0 0 1px rgba(226,232,240,.9);
        }

        .comment-item {
          background: rgba(248,250,252,.95);
          border-radius: 22px;
          padding: 13px;
          border: 1px solid rgba(226,232,240,.9);
        }

        .reply-item {
          background: rgba(255,255,255,.92);
          border-radius: 20px;
          padding: 12px;
          border: 1px solid rgba(226,232,240,.9);
          box-shadow: 0 8px 20px rgba(15,23,42,.04);
        }

        .mini-link {
          border: 0;
          background: transparent;
          padding: 0;
          font-weight: 800;
          color: #64748b;
          font-size: 13px;
        }

        .mini-link:hover {
          color: #2563eb;
        }

        .mention-dropdown {
          position: absolute;
          top: 54px;
          left: 0;
          right: 0;
          z-index: 999;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(18px);
          border-radius: 22px;
          box-shadow: 0 20px 45px rgba(15,23,42,.18);
          border: 1px solid rgba(226,232,240,.9);
          padding: 10px;
          max-height: 250px;
          overflow-y: auto;
        }

        .mention-option {
          cursor: pointer;
          border-radius: 16px;
          padding: 10px;
          transition: .2s;
        }

        .mention-option:hover {
          background: #eff6ff;
          transform: translateX(3px);
        }

        .mention-empty {
          padding: 14px;
          font-size: 13px;
          color: #64748b;
          text-align: center;
          font-weight: 700;
        }

        .empty-state {
          padding: 45px 20px;
          text-align: center;
          color: #64748b;
          font-weight: 700;
        }

        .empty-icon {
          width: 70px;
          height: 70px;
          border-radius: 25px;
          margin: 0 auto 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #dbeafe, #ede9fe);
          color: #2563eb;
          font-size: 30px;
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
<<<<<<< HEAD
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
=======
            transform: translateY(22px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .feed-page {
            padding: 25px 0;
          }

          .composer,
          .post-card {
            padding: 18px;
            border-radius: 24px;
          }

          .composer-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .action-bar {
            grid-template-columns: 1fr;
          }

          .avatar {
            width: 52px;
            height: 52px;
            border-radius: 18px;
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
          }
        }
      `}</style>

      <div className="feed-container px-3">
<<<<<<< HEAD
        <div className="glass-card create-box p-4 mb-4">
          <h4 className="fw-bold mb-3">Share something with your network</h4>

          <textarea
            className="form-control border-0 shadow-sm mb-3"
            rows="4"
            maxLength="500"
            placeholder="What's on your mind? Use #tag and @mention"
=======
        <div className="text-center mb-4">
          <h2 className="hero-title mb-1">CareerSync Network</h2>
          <p className="hero-subtitle mb-0">
            Share updates, tag people, post images and grow your professional circle.
          </p>
        </div>

        <div className="premium-card composer mb-4">
          <div className="composer-head">
            <div>
              <h4 className="fw-black fw-bold mb-1">Create a premium post</h4>
              <small className="text-muted fw-semibold">
                Use tags, mentions and images to make your update stand out.
              </small>
            </div>

            <span className="composer-pill">
              <i className="bi bi-stars me-1"></i>
              Network Feed
            </span>
          </div>

          <textarea
            className="form-control mb-3"
            rows="4"
            maxLength="500"
            placeholder="What's on your mind? Example: Just completed my React project 🚀"
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {preview && (
<<<<<<< HEAD
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
=======
            <div className="preview-wrap mb-3">
              <img src={preview} alt="Preview" className="post-image" />
              <button className="remove-img" onClick={removeImage}>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          )}

          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <input
<<<<<<< HEAD
                className="form-control"
                placeholder="Add tags: react, job, hiring"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                style={{ borderRadius: "14px" }}
=======
                className="form-control premium-input"
                placeholder="Tags: react, job, hiring"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
              />
            </div>

            <div className="col-md-6 d-flex gap-2">
<<<<<<< HEAD
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
=======
              <div className="position-relative flex-grow-1">
                <input
                  className="form-control premium-input"
                  placeholder="Mention user: Shubh..."
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
                            <div className="fw-bold">{u.name}</div>
                            <small className="text-muted">
                              {u.headline || u.email || "CareerSync user"}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="mention-empty">No user found</div>
                    )}
                  </div>
                )}
              </div>

              <button className="soft-btn" onClick={addMentionText}>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
                @
              </button>
            </div>
          </div>

<<<<<<< HEAD
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
=======
          {mentionIds.length > 0 && (
            <small className="text-primary fw-bold d-block mb-2">
              <i className="bi bi-person-check me-1"></i>
              {mentionIds.length} user tagged
            </small>
          )}

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <small className="text-muted fw-bold">{content.length}/500 characters</small>

              <button className="soft-btn" onClick={() => fileRef.current.click()}>
                <i className="bi bi-image me-2"></i>
                Add Photo
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
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
<<<<<<< HEAD
              className="btn btn-primary px-5 rounded-pill"
              onClick={handleCreate}
              disabled={loading || (!content.trim() && !image)}
            >
              {loading ? "Posting..." : "Post"}
=======
              className="premium-btn px-5"
              onClick={handleCreate}
              disabled={loading || (!content.trim() && !image)}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Posting
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill me-2"></i>
                  Publish
                </>
              )}
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
            </button>
          </div>
        </div>

        {posts.length === 0 && (
<<<<<<< HEAD
          <div className="glass-card p-4 text-center text-muted">
=======
          <div className="premium-card empty-state">
            <div className="empty-icon">
              <i className="bi bi-chat-square-heart"></i>
            </div>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
            No posts found
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
<<<<<<< HEAD
            currentUser={user}
=======
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
            onDelete={handleDelete}
            onLike={handleLike}
            onComment={handleComment}
            reload={loadPosts}
<<<<<<< HEAD
=======
            openProfile={openProfile}
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
          />
        ))}
      </div>
    </div>
  );
};

<<<<<<< HEAD
const PostCard = ({ post, currentUser, onDelete, onLike, onComment, reload }) => {
  const [comment, setComment] = useState("");

  const userImage = post.user?.profilePic
    ? post.user.profilePic.startsWith("http")
      ? post.user.profilePic
      : `${API}${post.user.profilePic}`
    : `https://ui-avatars.com/api/?name=${post.user?.name || "User"}&background=0d6efd&color=fff`;
=======
const PostCard = ({ post, onDelete, onLike, onComment, reload, openProfile }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const userImage = getProfileImage(post.user);
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59

  const postImage = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `${API}${post.image}`
    : "";

  return (
<<<<<<< HEAD
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
=======
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
              className="fw-bold mb-1 click-name"
              onClick={() => openProfile(post.user?._id)}
            >
              {post.user?.name || "Unknown User"}
            </h6>

            <div className="post-meta">
              <i className="bi bi-clock me-1"></i>
              {new Date(post.createdAt).toLocaleString()}
              {post.updatedAt !== post.createdAt && " • Edited"}
            </div>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
          </div>
        </div>

        {post.isOwner && (
<<<<<<< HEAD
          <button
            className="btn btn-outline-danger btn-sm delete-btn"
            onClick={() => onDelete(post._id)}
          >
=======
          <button className="btn btn-sm delete-btn" onClick={() => onDelete(post._id)}>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        )}
      </div>

<<<<<<< HEAD
      {post.content && (
        <p className="post-content mt-4 mb-3">{post.content}</p>
      )}
=======
      {post.content && <p className="post-content mb-3">{post.content}</p>}
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59

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
<<<<<<< HEAD
            <span key={u._id} className="mention-badge">
              @{u.name}
            </span>
=======
            <button
              key={u._id}
              type="button"
              className="mention-badge"
              onClick={() => openProfile(u._id)}
            >
              @{u.name}
            </button>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
          ))}
        </div>
      )}

<<<<<<< HEAD
      {postImage && (
        <img src={postImage} alt="Post" className="post-image mb-3" />
      )}

      <div className="d-flex gap-2 border-top border-bottom py-2">
=======
      {postImage && <img src={postImage} alt="Post" className="post-image mb-3" />}

      <div className="action-bar">
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
        <button className="action-btn" onClick={() => onLike(post._id)}>
          ❤️ {post.likes?.length || 0} Like
        </button>

<<<<<<< HEAD
        <button className="action-btn">
=======
        <button className="action-btn" onClick={() => setShowComments((prev) => !prev)}>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
          💬 {post.comments?.length || 0} Comment
        </button>
      </div>

<<<<<<< HEAD
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
=======
      {showComments && (
        <div className="comment-box">
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control comment-input"
              placeholder="Write a professional comment..."
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
              className="premium-btn px-4"
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
                openProfile={openProfile}
              />
            ))}
          </div>
        </div>
      )}
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
    </div>
  );
};

<<<<<<< HEAD
const CommentCard = ({ comment, postId, reload }) => {
=======
const CommentCard = ({ comment, postId, reload, openProfile }) => {
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
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
<<<<<<< HEAD
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
=======
      <div className="comment-item d-flex gap-2">
        <img
          src={getProfileImage(comment.user)}
          className="avatar-sm"
          alt=""
          onClick={() => openProfile(comment.user?._id)}
        />

        <div className="flex-grow-1">
          <strong className="click-name" onClick={() => openProfile(comment.user?._id)}>
            {comment.user?.name || "User"}
          </strong>

          <p className="mb-1 mt-1 small">{comment.text}</p>

          {comment.mentions?.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-1">
              {comment.mentions.map((u) => (
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

          <div className="d-flex gap-3 mt-2">
            <button className="mini-link" onClick={handleLikeComment}>
              ❤️ {comment.likes?.length || 0}
            </button>

            <button className="mini-link" onClick={() => setShowReply(!showReply)}>
              Reply
            </button>
          </div>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
        </div>
      </div>

      {showReply && (
        <div className="d-flex gap-2 mt-2 ms-4">
          <input
            type="text"
<<<<<<< HEAD
            className="form-control form-control-sm"
=======
            className="form-control comment-input"
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
            placeholder={`Reply to ${comment.user?.name || "User"}...`}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleReply();
            }}
          />

<<<<<<< HEAD
          <button className="btn btn-sm btn-primary" onClick={handleReply}>
=======
          <button className="premium-btn px-3" onClick={handleReply}>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
            Send
          </button>
        </div>
      )}

      <div className="ms-4 mt-2">
        {(comment.replies || []).map((r) => (
<<<<<<< HEAD
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
=======
          <div className="reply-item mb-2 d-flex gap-2" key={r._id}>
            <img
              src={getProfileImage(r.user)}
              className="avatar-sm"
              alt=""
              onClick={() => openProfile(r.user?._id)}
            />

            <div className="flex-grow-1">
              <strong className="click-name" onClick={() => openProfile(r.user?._id)}>
                {r.user?.name || "User"}
              </strong>

              <p className="mb-1 mt-1 small">{r.text}</p>

              {r.mentions?.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-1">
                  {r.mentions.map((u) => (
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

              <button className="mini-link" onClick={() => handleLikeReply(r._id)}>
                ❤️ {r.likes?.length || 0}
              </button>
            </div>
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EditableField from "../components/EditableField";
import Experience from "../components/profile/Experience";
import Skills from "../components/profile/Skills";
import Education from "../components/profile/Education";
import Resume from "../components/profile/Resume";
import PersonalDetails from "../components/profile/PersonalDetails";
import PreferredLanguage from "../components/profile/PreferredLanguage";
import Bio from "../components/profile/Bio";

import { getConnectedPeople } from "../api/connectionApi";
import { getEducations } from "../api/educationApi";
import {
  getMyPosts,
  deletePost,
  updatePost,
} from "../api/postApi";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL = "http://localhost:5000";


// ============================================================
// PROFILE COMPONENT
// ============================================================

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================================
  // USER / PROFILE STATES
  // ==========================================================

  const [user, setUser] = useState(null);
  const [connectedPeople, setConnectedPeople] = useState([]);

  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    dob: "",
    linkedin: "",
    github: "",
    facebook: "",
  });

  // ==========================================================
  // PROFILE IMAGE
  // ==========================================================

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // ==========================================================
  // FEED STATES
  // ==========================================================

  const [showMyFeed, setShowMyFeed] = useState(true);
  const [myPosts, setMyPosts] = useState([]);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");

  // Comments
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});

  const [replyTarget, setReplyTarget] = useState(null);

  const [expandedComments, setExpandedComments] = useState({});
  const [expandedLikes, setExpandedLikes] = useState({});

  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState({});

  // ==========================================================
  // VIEW ONLY
  // ==========================================================

  const viewOnly = location.state?.viewOnly === true;
  const profileUserId = location.state?.profileUserId;

  // ==========================================================
  // OTHER DATA
  // ==========================================================

  const [newSkill, setNewSkill] = useState("");

  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    year: "",
  });

  // ==========================================================
  // THEME
  // ==========================================================

  const theme = {
    bg: "#f5f7ff",
    cardBg: "#ffffff",
    primaryPurple: "#6366f1",
    secondaryPurple: "#7c3aed",
    accentBlue: "#0ea5e9",
    textDark: "#111827",
    textLight: "#64748b",
    border: "#e2e8f0",
    softPurple: "#eef2ff",
    softBlue: "#eff6ff",
    danger: "#ef4444",
    success: "#10b981",
  };

  // ==========================================================
  // AVAILABLE SKILLS
  // ==========================================================

  const availableSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "Java",
    "SQL",
    "DevOps",
    "UI/UX",
    "C++",
  ];

  // ==========================================================
  // TOKEN
  // ==========================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================================
  // COMMON API REQUEST
  // ==========================================================

  const postRequest = async (url, options = {}) => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : {
              "Content-Type": "application/json",
            }),
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Something went wrong"
      );
    }

    return data;
  };

  // ==========================================================
  // LOAD MY POSTS
  // ==========================================================

  const loadMyPosts = async () => {
    try {
      const posts = await getMyPosts();

      setMyPosts(Array.isArray(posts) ? posts : []);
    } catch (error) {
      console.error("My posts error:", error);
      setMyPosts([]);
    }
  };

  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();

        const url =
          viewOnly && profileUserId
            ? `${API_BASE_URL}/api/profile-search/${profileUserId}`
            : `${API_BASE_URL}/api/users/profile`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Profile request failed:",
            data
          );
          return;
        }

        const profileData =
          data.profile ||
          data.user ||
          data;

        setUser(profileData);

        setEditedUser({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          dob: profileData.dob || "",
          linkedin: profileData.linkedin || "",
          github: profileData.github || "",
          facebook: profileData.facebook || "",
        });

        setSkills(
          profileData.skills ||
            data.skills ||
            []
        );

        setExperience(
          profileData.experience ||
            profileData.experiences ||
            data.experience ||
            data.experiences ||
            []
        );
        console.log("profileData.education:", profileData);
        setEducation(
          profileData.education ||
            profileData.educations ||
            data.education ||
            data.educations ||
            []
        );

        setLanguages(
          profileData.languages ||
            data.languages ||
            []
        );
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error
        );
      }
    };

    fetchProfile();
  }, [viewOnly, profileUserId]);

  // ==========================================================
  // LOAD POSTS
  // ==========================================================

  useEffect(() => {
    if (!viewOnly) {
      loadMyPosts();
    }
  }, [viewOnly]);

  // ==========================================================
  // LOAD EDUCATION
  // ==========================================================

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        if (viewOnly) return;

        const data = await getEducations();

        setEducation(data || []);
      } catch (error) {
        console.error(
          "Education error:",
          error
        );
      }
    };

    fetchEducation();
  }, [viewOnly]);

  // ==========================================================
  // LOAD CONNECTED PEOPLE
  // ==========================================================

  useEffect(() => {
    const loadConnectedPeople = async () => {
      try {
        const people =
          await getConnectedPeople();

        setConnectedPeople(
          people || []
        );
      } catch (error) {
        console.error(
          "Connected people error:",
          error
        );
      }
    };

    loadConnectedPeople();
  }, []);

  // ==========================================================
  // PROFILE IMAGE
  // ==========================================================

  const getProfileImage = () => {
    if (selectedImage) {
      return selectedImage;
    }

    if (user?.profilePic) {
      return user.profilePic.startsWith(
        "http"
      )
        ? user.profilePic
        : `${API_BASE_URL}${user.profilePic}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=6366f1&color=fff&size=256`;
  };

  // ==========================================================
  // PERSON IMAGE
  // ==========================================================

  const getPersonImage = (person) => {
    if (person?.profilePic) {
      return person.profilePic.startsWith(
        "http"
      )
        ? person.profilePic
        : `${API_BASE_URL}${person.profilePic}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      person?.name || "User"
    )}&background=6366f1&color=fff`;
  };

  // ==========================================================
  // POST AUTHOR IMAGE
  // ==========================================================

  const getPostAuthorImage = (post) => {
    const photo =
      post?.user?.profilePic ||
      post?.author?.profilePic ||
      post?.profilePic;

    if (photo) {
      return photo.startsWith("http")
        ? photo
        : `${API_BASE_URL}${photo}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      post?.user?.name ||
        post?.author?.name ||
        user?.name ||
        "User"
    )}&background=6366f1&color=fff`;
  };

  // ==========================================================
  // MEDIA URL
  // ==========================================================

  const getMediaUrl = (media) => {
    if (!media) return "";

    if (typeof media === "string") {
      return media.startsWith("http")
        ? media
        : `${API_BASE_URL}${media}`;
    }

    if (media.url) {
      return media.url.startsWith("http")
        ? media.url
        : `${API_BASE_URL}${media.url}`;
    }

    if (media.path) {
      return media.path.startsWith("http")
        ? media.path
        : `${API_BASE_URL}${media.path}`;
    }

    return "";
  };

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not added";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString();
  };

  // ==========================================================
  // SKILL NAME
  // ==========================================================

  const getSkillName = (skill) => {
    if (!skill) return "Skill";

    if (typeof skill === "object") {
      return (
        skill.name ||
        skill.skill ||
        "Skill"
      );
    }

    return skill;
  };

  // ==========================================================
  // RESUME
  // ==========================================================

  const getResumeLink = () => {
    if (!user?.resume) return null;

    return user.resume.startsWith("http")
      ? user.resume
      : `${API_BASE_URL}${user.resume}`;
  };

  // ==========================================================
  // CONNECTED PROFILE
  // ==========================================================

  const openConnectedProfile = (userId) => {
    if (!userId) return;

    navigate("/profile", {
      state: {
        viewOnly: true,
        profileUserId: userId,
      },
    });
  };

  // ==========================================================
  // PROFILE PHOTO UPLOAD
  // ==========================================================

  const handleImageChange = async (e) => {
    if (viewOnly) return;

    const file = e.target.files?.[0];

    if (!file) return;

    const token = getToken();

    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(
        reader.result
      );
    };

    reader.readAsDataURL(file);

    const formData = new FormData();

    formData.append(
      "profilePhoto",
      file
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/profile-picture`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setUser(
          data.user || data
        );
      } else {
        alert(
          data.message ||
            "Upload failed"
        );
      }
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      alert(
        "Unable to upload profile picture"
      );
    }
  };

  // ==========================================================
  // UPDATE PROFILE FIELD
  // ==========================================================

  const updateField = async (
    field,
    value
  ) => {
    if (viewOnly) {
      return user;
    }

    try {
      const data =
        await postRequest(
          "/api/users/update-field",
          {
            method: "PUT",
            body: JSON.stringify({
              field,
              value,
            }),
          }
        );

      setUser((prev) => ({
        ...prev,
        [field]: value,
      }));

      return data;
    } catch (error) {
      console.error(
        "Update field error:",
        error
      );

      alert(
        error.message ||
          "Unable to update field"
      );
    }
  };

  // ==========================================================
  // SAVE LANGUAGES
  // ==========================================================

  const saveLanguages = async (
    updatedLanguages
  ) => {
    if (viewOnly) return;

    try {
      const data =
        await postRequest(
          "/api/users/update-field",
          {
            method: "PUT",
            body: JSON.stringify({
              field: "languages",
              value: updatedLanguages,
            }),
          }
        );

      const updatedUser =
        data.user || data;

      setUser(updatedUser);

      setLanguages(
        updatedUser.languages ||
          updatedLanguages
      );
    } catch (error) {
      console.error(
        "Language update error:",
        error
      );

      alert(
        error.message ||
          "Unable to save languages"
      );
    }
  };

  // ==========================================================
  // PROFILE SAVE
  // ==========================================================

  const handleProfileSave = async () => {
    if (viewOnly) return;

    window.location.reload();
  };

  // ==========================================================
  // DELETE POST
  // ==========================================================

  const handleDeletePost = async (
    postId
  ) => {
    if (viewOnly) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmed) return;

    try {
      await deletePost(postId);

      setMyPosts((prev) =>
        prev.filter(
          (post) =>
            post._id !== postId
        )
      );
    } catch (error) {
      console.error(
        "Delete post error:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          error.message ||
          "Unable to delete post"
      );
    }
  };

  // ==========================================================
  // START EDIT POST
  // ==========================================================

  const startEditPost = (post) => {
    if (viewOnly) return;

    setEditingPostId(
      post._id
    );

    setEditPostContent(
      post.content || ""
    );
  };

  // ==========================================================
  // CANCEL EDIT
  // ==========================================================

  const cancelEditPost = () => {
    setEditingPostId(null);
    setEditPostContent("");
  };

  // ==========================================================
  // UPDATE POST
  // ==========================================================

  const handleUpdatePost = async (
    postId
  ) => {
    if (viewOnly) return;

    if (!editPostContent.trim()) {
      alert(
        "Post content cannot be empty"
      );
      return;
    }

    try {
      const updated =
        await updatePost(postId, {
          content:
            editPostContent.trim(),
        });

      setMyPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                ...(updated?.post ||
                  updated ||
                  {}),
                content:
                  editPostContent.trim(),
              }
            : post
        )
      );

      cancelEditPost();
    } catch (error) {
      console.error(
        "Update post error:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Unable to update post"
      );
    }
  };

  // ==========================================================
  // LIKE POST
  // ==========================================================

  const handleLikePost = async (
    postId
  ) => {
    if (viewOnly) return;

    if (likeLoading[postId]) return;

    setLikeLoading((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      const data =
        await postRequest(
          `/api/posts/${postId}/like`,
          {
            method: "POST",
          }
        );

      const updatedPost =
        data.post || data;

      setMyPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                ...updatedPost,
                likes:
                  updatedPost.likes ??
                  post.likes,
              }
            : post
        )
      );
    } catch (error) {
      console.error(
        "Like error:",
        error
      );

      alert(
        error.message ||
          "Unable to like post"
      );
    } finally {
      setLikeLoading((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  // ==========================================================
  // ADD COMMENT
  // ==========================================================

  const handleAddComment = async (
    postId
  ) => {
    if (viewOnly) return;

    const text =
      commentText[postId]?.trim();

    if (!text) return;

    setCommentLoading(true);

    try {
      const data =
        await postRequest(
          `/api/posts/${postId}/comments`,
          {
            method: "POST",
            body: JSON.stringify({
              content: text,
            }),
          }
        );

      const updatedPost =
        data.post || data;

      setMyPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                ...updatedPost,
                comments:
                  updatedPost.comments ??
                  [
                    ...(post.comments ||
                      []),
                  ],
              }
            : post
        )
      );

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      setExpandedComments(
        (prev) => ({
          ...prev,
          [postId]: true,
        })
      );
    } catch (error) {
      console.error(
        "Comment error:",
        error
      );

      alert(
        error.message ||
          "Unable to add comment"
      );
    } finally {
      setCommentLoading(false);
    }
  };

  // ==========================================================
  // ADD REPLY
  // ==========================================================

  const handleAddReply = async (
    postId,
    commentId
  ) => {
    if (viewOnly) return;

    const key = `${postId}-${commentId}`;

    const text =
      replyText[key]?.trim();

    if (!text) return;

    try {
      const data =
        await postRequest(
          `/api/posts/${postId}/comments/${commentId}/reply`,
          {
            method: "POST",
            body: JSON.stringify({
              content: text,
            }),
          }
        );

      const updatedPost =
        data.post || data;

      setMyPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                ...updatedPost,
              }
            : post
        )
      );

      setReplyText((prev) => ({
        ...prev,
        [key]: "",
      }));

      setReplyTarget(null);
    } catch (error) {
      console.error(
        "Reply error:",
        error
      );

      alert(
        error.message ||
          "Unable to add reply"
      );
    }
  };

  // ==========================================================
  // DELETE COMMENT
  // ==========================================================

  const handleDeleteComment = async (
    postId,
    commentId
  ) => {
    if (viewOnly) return;

    const confirmed =
      window.confirm(
        "Delete this comment?"
      );

    if (!confirmed) return;

    try {
      const data =
        await postRequest(
          `/api/posts/${postId}/comments/${commentId}`,
          {
            method: "DELETE",
          }
        );

      const updatedPost =
        data.post || data;

      setMyPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                ...updatedPost,
              }
            : post
        )
      );
    } catch (error) {
      console.error(
        "Delete comment error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete comment"
      );
    }
  };

  // ==========================================================
  // DELETE REPLY
  // ==========================================================

  const handleDeleteReply = async (
    postId,
    commentId,
    replyId
  ) => {
    if (viewOnly) return;

    const confirmed =
      window.confirm(
        "Delete this reply?"
      );

    if (!confirmed) return;

    try {
      const data =
        await postRequest(
          `/api/posts/${postId}/comments/${commentId}/reply/${replyId}`,
          {
            method: "DELETE",
          }
        );

      const updatedPost =
        data.post || data;

      setMyPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                ...updatedPost,
              }
            : post
        )
      );
    } catch (error) {
      console.error(
        "Delete reply error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete reply"
      );
    }
  };

  // ==========================================================
  // TOGGLE COMMENTS
  // ==========================================================

  const toggleComments = (
    postId
  ) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]:
        !prev[postId],
    }));
  };

  // ==========================================================
  // TOGGLE LIKES
  // ==========================================================

  const toggleLikes = (
    postId
  ) => {
    setExpandedLikes((prev) => ({
      ...prev,
      [postId]:
        !prev[postId],
    }));
  };

  // ==========================================================
  // GET LIKE USER NAME
  // ==========================================================

  const getLikeUserName = (
    like
  ) => {
    if (!like) return "User";

    if (typeof like === "string") {
      return like;
    }

    return (
      like.name ||
      like.user?.name ||
      like.username ||
      "User"
    );
  };

  // ==========================================================
  // GET COMMENT USER
  // ==========================================================

  const getCommentUser = (
    comment
  ) => {
    if (!comment) return "User";

    return (
      comment.user?.name ||
      comment.author?.name ||
      comment.name ||
      comment.username ||
      "User"
    );
  };

  // ==========================================================
  // GET COMMENT IMAGE
  // ==========================================================

  const getCommentUserImage = (
    comment
  ) => {
    const image =
      comment?.user?.profilePic ||
      comment?.author?.profilePic ||
      comment?.profilePic;

    if (image) {
      return image.startsWith("http")
        ? image
        : `${API_BASE_URL}${image}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getCommentUser(comment)
    )}&background=6366f1&color=fff`;
  };

  // ==========================================================
  // RENDER REPLIES
  // ==========================================================

  const renderReplies = (
    post,
    comment
  ) => {
    const replies =
      comment.replies || [];

    if (!replies.length) {
      return null;
    }

    return (
      <div
        style={{
          marginLeft: "48px",
          marginTop: "10px",
        }}
      >
        {replies.map(
          (reply, index) => {
            const replyId =
              reply._id ||
              reply.id ||
              index;

            return (
              <div
                key={replyId}
                className="d-flex gap-2 mb-3"
              >
                <img
                  src={getCommentUserImage(
                    reply
                  )}
                  width="32"
                  height="32"
                  className="rounded-circle"
                  style={{
                    objectFit: "cover",
                  }}
                  alt=""
                />

                <div
                  className="flex-grow-1"
                >
                  <div
                    style={{
                      background:
                        "#f8fafc",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "14px",
                      padding:
                        "10px 12px",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <strong
                        style={{
                          fontSize:
                            "13px",
                        }}
                      >
                        {getCommentUser(
                          reply
                        )}
                      </strong>

                      {!viewOnly && (
                        <button
                          className="btn btn-sm p-0"
                          style={{
                            color:
                              "#ef4444",
                            fontSize:
                              "12px",
                          }}
                          onClick={() =>
                            handleDeleteReply(
                              post._id,
                              comment._id,
                              replyId
                            )
                          }
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize:
                          "13px",
                        color:
                          "#475569",
                        marginTop:
                          "3px",
                      }}
                    >
                      {reply.content ||
                        reply.text ||
                        ""}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    );
  };

  // ==========================================================
  // COMMENT SECTION
  // ==========================================================

  const renderComments = (
    post
  ) => {
    const comments =
      post.comments || [];

    if (!expandedComments[post._id]) {
      return null;
    }

    return (
      <div
        className="mt-3 pt-3"
        style={{
          borderTop:
            "1px solid #e2e8f0",
        }}
      >
        {comments.length === 0 ? (
          <div
            className="text-center py-3"
            style={{
              color: "#94a3b8",
            }}
          >
            <i
              className="bi bi-chat-square-text"
              style={{
                fontSize: "25px",
              }}
            ></i>

            <div
              style={{
                fontSize: "13px",
                marginTop: "5px",
              }}
            >
              No comments yet
            </div>
          </div>
        ) : (
          comments.map(
            (comment, index) => {
              const commentId =
                comment._id ||
                comment.id ||
                index;

              const replyKey = `${post._id}-${commentId}`;

              return (
                <div
                  key={commentId}
                  className="mb-4"
                >
                  <div className="d-flex gap-3">
                    <img
                      src={getCommentUserImage(
                        comment
                      )}
                      width="40"
                      height="40"
                      className="rounded-circle"
                      style={{
                        objectFit:
                          "cover",
                      }}
                      alt=""
                    />

                    <div className="flex-grow-1">
                      <div
                        style={{
                          background:
                            "#f8fafc",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "16px",
                          padding:
                            "12px 14px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <strong
                            style={{
                              fontSize:
                                "14px",
                              color:
                                "#111827",
                            }}
                          >
                            {getCommentUser(
                              comment
                            )}
                          </strong>

                          {!viewOnly && (
                            <button
                              className="btn btn-sm p-0"
                              style={{
                                color:
                                  "#ef4444",
                                fontSize:
                                  "12px",
                              }}
                              onClick={() =>
                                handleDeleteComment(
                                  post._id,
                                  commentId
                                )
                              }
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          )}
                        </div>

                        <p
                          className="mb-1 mt-1"
                          style={{
                            fontSize:
                              "14px",
                            color:
                              "#475569",
                          }}
                        >
                          {comment.content ||
                            comment.text ||
                            ""}
                        </p>

                        <div className="d-flex gap-3 mt-2">
                          {!viewOnly && (
                            <button
                              className="btn btn-sm p-0"
                              style={{
                                color:
                                  "#6366f1",
                                fontWeight:
                                  "600",
                                fontSize:
                                  "12px",
                              }}
                              onClick={() =>
                                setReplyTarget(
                                  replyTarget ===
                                    replyKey
                                    ? null
                                    : replyKey
                                )
                              }
                            >
                              <i className="bi bi-reply me-1"></i>
                              Reply
                            </button>
                          )}

                          {comment.replies?.length >
                            0 && (
                            <span
                              style={{
                                fontSize:
                                  "12px",
                                color:
                                  "#64748b",
                              }}
                            >
                              {
                                comment
                                  .replies
                                  .length
                              }{" "}
                              replies
                            </span>
                          )}
                        </div>
                      </div>

                      {replyTarget ===
                        replyKey &&
                        !viewOnly && (
                          <div
                            className="d-flex gap-2 mt-2"
                          >
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Write a reply..."
                              value={
                                replyText[
                                  replyKey
                                ] || ""
                              }
                              onChange={(e) =>
                                setReplyText(
                                  (
                                    prev
                                  ) => ({
                                    ...prev,
                                    [replyKey]:
                                      e
                                        .target
                                        .value,
                                  })
                                )
                              }
                              onKeyDown={(
                                e
                              ) => {
                                if (
                                  e.key ===
                                  "Enter"
                                ) {
                                  handleAddReply(
                                    post._id,
                                    commentId
                                  );
                                }
                              }}
                              style={{
                                borderRadius:
                                  "12px",
                                fontSize:
                                  "13px",
                              }}
                            />

                            <button
                              className="btn"
                              style={{
                                background:
                                  theme.primaryPurple,
                                color:
                                  "#fff",
                                borderRadius:
                                  "12px",
                                minWidth:
                                  "75px",
                              }}
                              onClick={() =>
                                handleAddReply(
                                  post._id,
                                  commentId
                                )
                              }
                            >
                              Reply
                            </button>
                          </div>
                        )}

                      {renderReplies(
                        post,
                        comment
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )
        )}

        {!viewOnly && (
          <div
            className="d-flex gap-2 mt-3"
          >
            <img
              src={getProfileImage()}
              width="40"
              height="40"
              className="rounded-circle"
              style={{
                objectFit: "cover",
              }}
              alt=""
            />

            <input
              type="text"
              className="form-control"
              placeholder="Write a comment..."
              value={
                commentText[
                  post._id
                ] || ""
              }
              onChange={(e) =>
                setCommentText(
                  (prev) => ({
                    ...prev,
                    [post._id]:
                      e.target.value,
                  })
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleAddComment(
                    post._id
                  );
                }
              }}
              style={{
                borderRadius:
                  "14px",
                background:
                  "#fff",
              }}
            />

            <button
              className="btn"
              disabled={
                commentLoading
              }
              style={{
                background:
                  "linear-gradient(135deg,#6366f1,#7c3aed)",
                color: "#fff",
                borderRadius:
                  "14px",
                padding:
                  "0 18px",
              }}
              onClick={() =>
                handleAddComment(
                  post._id
                )
              }
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        )}
      </div>
    );
  };

  // ==========================================================
  // MY FEED SECTION
  // ==========================================================

  const MyFeedSection = () => (
    <div
      className="card border-0 shadow-sm mb-4"
      style={{
        borderRadius: "28px",
        background:
          "rgba(255,255,255,0.96)",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          padding: "25px 28px",
          background:
            "linear-gradient(135deg,#6366f1,#7c3aed,#4f46e5)",
          color: "#fff",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div
              className="d-flex align-items-center gap-2"
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius:
                    "14px",
                  background:
                    "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  backdropFilter:
                    "blur(10px)",
                }}
              >
                <i className="bi bi-collection-fill fs-5"></i>
              </div>

              <h4
                className="fw-bold mb-0"
              >
                My Feed
              </h4>
            </div>

            <p
              className="mb-0 mt-2"
              style={{
                opacity: 0.85,
                fontSize: "14px",
              }}
            >
              Manage your posts,
              comments, likes and
              replies.
            </p>
          </div>

          <div
            className="text-center"
            style={{
              minWidth: "70px",
              padding:
                "10px 14px",
              borderRadius:
                "16px",
              background:
                "rgba(255,255,255,0.16)",
            }}
          >
            <div
              className="fw-bold fs-5"
            >
              {myPosts.length}
            </div>

            <small
              style={{
                opacity: 0.8,
              }}
            >
              Posts
            </small>
          </div>
        </div>
      </div>

      {/* POSTS */}

      <div
        style={{
          padding: "24px",
        }}
      >
        {myPosts.length === 0 ? (
          <div
            className="text-center py-5"
          >
            <div
              style={{
                width: "75px",
                height: "75px",
                borderRadius:
                  "24px",
                margin:
                  "0 auto",
                background:
                  "#eef2ff",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                color:
                  theme.primaryPurple,
              }}
            >
              <i
                className="bi bi-file-post"
                style={{
                  fontSize:
                    "32px",
                }}
              ></i>
            </div>

            <h5
              className="fw-bold mt-3"
            >
              No posts yet
            </h5>

            <p className="text-muted">
              Your posts will
              appear here.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {myPosts.map(
              (post) => {
                const comments =
                  post.comments ||
                  [];

                const likes =
                  post.likes || [];

                const media =
                  post.image ||
                  post.imageUrl ||
                  post.mediaUrl ||
                  post.media;

                const mediaList =
                  post.images ||
                  post.mediaFiles ||
                  [];

                return (
                  <div
                    key={post._id}
                    style={{
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "24px",
                      background:
                        "#fff",
                      overflow:
                        "hidden",
                      transition:
                        "all .25s ease",
                    }}
                    onMouseEnter={(
                      e
                    ) => {
                      e.currentTarget.style.boxShadow =
                        "0 18px 45px rgba(15,23,42,.08)";
                      e.currentTarget.style.transform =
                        "translateY(-2px)";
                    }}
                    onMouseLeave={(
                      e
                    ) => {
                      e.currentTarget.style.boxShadow =
                        "none";
                      e.currentTarget.style.transform =
                        "translateY(0)";
                    }}
                  >
                    {/* POST HEADER */}

                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{
                        padding:
                          "18px 20px",
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={getPostAuthorImage(
                            post
                          )}
                          width="48"
                          height="48"
                          className="rounded-circle"
                          style={{
                            objectFit:
                              "cover",
                            border:
                              "3px solid #eef2ff",
                          }}
                          alt=""
                        />

                        <div>
                          <h6
                            className="fw-bold mb-1"
                          >
                            {post
                              .user
                              ?.name ||
                              post
                                .author
                                ?.name ||
                              user.name}
                          </h6>

                          <small
                            className="text-muted"
                          >
                            {post.createdAt
                              ? new Date(
                                  post.createdAt
                                ).toLocaleString()
                              : "Recently"}
                            {post.updatedAt &&
                            post.createdAt &&
                            new Date(
                              post.updatedAt
                            ).getTime() !==
                              new Date(
                                post.createdAt
                              ).getTime()
                              ? " • Edited"
                              : ""}
                          </small>
                        </div>
                      </div>

                      {!viewOnly && (
                        <div className="dropdown">
                          <button
                            className="btn btn-light rounded-circle"
                            data-bs-toggle="dropdown"
                            style={{
                              width:
                                "40px",
                              height:
                                "40px",
                            }}
                          >
                            <i className="bi bi-three-dots"></i>
                          </button>

                          <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4">
                            <li>
                              <button
                                className="dropdown-item rounded-3"
                                onClick={() =>
                                  startEditPost(
                                    post
                                  )
                                }
                              >
                                <i className="bi bi-pencil me-2"></i>
                                Edit Post
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item text-danger rounded-3"
                                onClick={() =>
                                  handleDeletePost(
                                    post._id
                                  )
                                }
                              >
                                <i className="bi bi-trash3 me-2"></i>
                                Delete Post
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* POST CONTENT */}

                    <div
                      style={{
                        padding:
                          "0 20px 15px",
                      }}
                    >
                      {editingPostId ===
                      post._id ? (
                        <div>
                          <textarea
                            className="form-control"
                            rows="5"
                            value={
                              editPostContent
                            }
                            onChange={(e) =>
                              setEditPostContent(
                                e
                                  .target
                                  .value
                              )
                            }
                            style={{
                              borderRadius:
                                "16px",
                              border:
                                "1px solid #c7d2fe",
                              resize:
                                "vertical",
                            }}
                          />

                          <div className="d-flex gap-2 mt-3">
                            <button
                              className="btn fw-bold"
                              style={{
                                background:
                                  "linear-gradient(135deg,#6366f1,#7c3aed)",
                                color:
                                  "#fff",
                                borderRadius:
                                  "12px",
                              }}
                              onClick={() =>
                                handleUpdatePost(
                                  post._id
                                )
                              }
                            >
                              <i className="bi bi-check-lg me-1"></i>
                              Save
                            </button>

                            <button
                              className="btn btn-light fw-bold"
                              style={{
                                borderRadius:
                                  "12px",
                              }}
                              onClick={
                                cancelEditPost
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p
                          style={{
                            whiteSpace:
                              "pre-wrap",
                            fontSize:
                              "15px",
                            lineHeight:
                              "1.7",
                            color:
                              "#334155",
                            marginBottom:
                              "12px",
                          }}
                        >
                          {post.content}
                        </p>
                      )}

                      {/* SINGLE IMAGE */}

                      {!editingPostId &&
                        media && (
                          <img
                            src={getMediaUrl(
                              media
                            )}
                            alt="Post"
                            className="w-100"
                            style={{
                              maxHeight:
                                "520px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "18px",
                            }}
                          />
                        )}

                      {/* MULTIPLE IMAGES */}

                      {!editingPostId &&
                        !media &&
                        mediaList.length >
                          0 && (
                          <div
                            className="row g-2"
                          >
                            {mediaList.map(
                              (
                                image,
                                index
                              ) => (
                                <div
                                  className={
                                    mediaList.length ===
                                    1
                                      ? "col-12"
                                      : "col-md-6"
                                  }
                                  key={
                                    index
                                  }
                                >
                                  <img
                                    src={getMediaUrl(
                                      image
                                    )}
                                    alt="Post media"
                                    className="w-100"
                                    style={{
                                      height:
                                        "260px",
                                      objectFit:
                                        "cover",
                                      borderRadius:
                                        "16px",
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>

                    {/* STATISTICS */}

                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        padding:
                          "12px 20px",
                        borderTop:
                          "1px solid #eef2f7",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span
                          style={{
                            width:
                              "25px",
                            height:
                              "25px",
                            borderRadius:
                              "50%",
                            background:
                              "#fee2e2",
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color:
                              "#ef4444",
                            fontSize:
                              "12px",
                          }}
                        >
                          ❤️
                        </span>

                        <span
                          className="text-muted"
                          style={{
                            fontSize:
                              "13px",
                          }}
                        >
                          {likes.length}{" "}
                          Likes
                        </span>

                        {likes.length >
                          0 && (
                          <button
                            className="btn btn-sm p-0 ms-1"
                            style={{
                              color:
                                theme.primaryPurple,
                              fontSize:
                                "12px",
                            }}
                            onClick={() =>
                              toggleLikes(
                                post._id
                              )
                            }
                          >
                            {expandedLikes[
                              post._id
                            ]
                              ? "Hide"
                              : "View"}
                          </button>
                        )}
                      </div>

                      <button
                        className="btn btn-sm p-0 text-muted"
                        onClick={() =>
                          toggleComments(
                            post._id
                          )
                        }
                        style={{
                          fontSize:
                            "13px",
                        }}
                      >
                        {comments.length}{" "}
                        Comments
                      </button>
                    </div>

                    {/* LIKES */}

                    {expandedLikes[
                      post._id
                    ] &&
                      likes.length >
                        0 && (
                        <div
                          style={{
                            padding:
                              "10px 20px",
                            background:
                              "#f8fafc",
                            borderTop:
                              "1px solid #eef2f7",
                          }}
                        >
                          <div
                            className="d-flex flex-wrap gap-2"
                          >
                            {likes.map(
                              (
                                like,
                                index
                              ) => (
                                <span
                                  key={
                                    like._id ||
                                    index
                                  }
                                  className="badge rounded-pill"
                                  style={{
                                    background:
                                      "#eef2ff",
                                    color:
                                      "#4f46e5",
                                    padding:
                                      "8px 12px",
                                  }}
                                >
                                  <i className="bi bi-heart-fill me-1"></i>
                                  {getLikeUserName(
                                    like
                                  )}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* ACTION BAR */}

                    <div
                      className="d-flex"
                      style={{
                        borderTop:
                          "1px solid #eef2f7",
                        borderBottom:
                          "1px solid #eef2f7",
                      }}
                    >
                      <button
                        className="btn flex-fill rounded-0 py-3"
                        style={{
                          color:
                            theme.primaryPurple,
                          fontWeight:
                            "600",
                        }}
                        disabled={
                          likeLoading[
                            post._id
                          ]
                        }
                        onClick={() =>
                          handleLikePost(
                            post._id
                          )
                        }
                      >
                        <i className="bi bi-heart me-2"></i>
                        Like
                      </button>

                      <button
                        className="btn flex-fill rounded-0 py-3"
                        style={{
                          color:
                            "#475569",
                          fontWeight:
                            "600",
                        }}
                        onClick={() =>
                          toggleComments(
                            post._id
                          )
                        }
                      >
                        <i className="bi bi-chat-left-text me-2"></i>
                        Comment
                      </button>

                      <button
                        className="btn flex-fill rounded-0 py-3"
                        style={{
                          color:
                            "#475569",
                          fontWeight:
                            "600",
                        }}
                        onClick={() =>
                          toggleComments(
                            post._id
                          )
                        }
                      >
                        <i className="bi bi-reply me-2"></i>
                        Reply
                      </button>
                    </div>

                    {/* COMMENTS */}

                    {renderComments(
                      post
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================================
  // CONNECTED PEOPLE
  // ==========================================================

  const ConnectedPeopleCard = () => (
    <div
      className="card border-0 p-4 mb-4 shadow-sm"
      style={{
        borderRadius: "24px",
        background:
          theme.cardBg,
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">
          Connected People
        </h5>

        <span
          className="badge rounded-pill"
          style={{
            background:
              theme.softPurple,
            color:
              theme.primaryPurple,
            padding:
              "8px 12px",
          }}
        >
          {connectedPeople.length}
        </span>
      </div>

      {connectedPeople.length ===
      0 ? (
        <p className="text-muted mb-0">
          No connected people yet.
        </p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {connectedPeople.map(
            (person) => (
              <div
                key={person._id}
                className="d-flex align-items-center gap-3 p-2 rounded-4"
                style={{
                  background:
                    "#f8fafc",
                  cursor:
                    "pointer",
                  border:
                    "1px solid #e2e8f0",
                }}
                onClick={() =>
                  openConnectedProfile(
                    person._id
                  )
                }
              >
                <img
                  src={getPersonImage(
                    person
                  )}
                  alt=""
                  width="45"
                  height="45"
                  className="rounded-circle"
                  style={{
                    objectFit:
                      "cover",
                  }}
                />

                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">
                    {person.name}
                  </h6>

                  <small className="text-muted">
                    {person.role ||
                      person.location ||
                      person.email ||
                      "CareerSync user"}
                  </small>
                </div>

                <i
                  className="bi bi-chevron-right"
                  style={{
                    color:
                      theme.textLight,
                  }}
                ></i>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  // ==========================================================
  // LOADING
  // ==========================================================

  if (!user) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          background:
            theme.bg,
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{
              color:
                theme.primaryPurple,
              width: "3rem",
              height: "3rem",
            }}
          ></div>

          <h5
            className="fw-bold mt-3"
            style={{
              color:
                theme.primaryPurple,
            }}
          >
            Loading Profile...
          </h5>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f5f7ff,#eef4ff)",
        color:
          theme.textDark,
        padding:
          "40px 20px",
        fontFamily:
          "'Inter', sans-serif",
      }}
    >
      <div className="container">

        {/* VIEW ONLY BACK */}

        {viewOnly && (
          <>
            <button
              className="btn mb-4 shadow-sm d-inline-flex align-items-center gap-2"
              style={{
                background: "#fff",
                color:
                  theme.primaryPurple,
                border:
                  "1px solid #e2e8f0",
                borderRadius:
                  "12px",
                fontWeight:
                  "600",
              }}
              onClick={() =>
                navigate(-1)
              }
            >
              <i className="bi bi-arrow-left"></i>
              Back
            </button>

            <div
              className="alert border-0 shadow-sm mb-4"
              style={{
                borderRadius:
                  "16px",
                background:
                  "#eef2ff",
                color:
                  "#4f46e5",
              }}
            >
              <i className="bi bi-eye me-2"></i>
              You are viewing this
              profile in read-only
              mode.
            </div>
          </>
        )}

        <div className="row g-4">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="col-lg-4">

            {/* PROFILE CARD */}

            <div
              className="card border-0 p-4 text-center mb-4 shadow-sm"
              style={{
                borderRadius:
                  "28px",
                background:
                  "#fff",
              }}
            >
              <div
                className="position-relative d-inline-block mx-auto mb-3"
              >
                <img
                  src={getProfileImage()}
                  className="rounded-circle p-1"
                  style={{
                    border:
                      "4px solid #6366f1",
                    objectFit:
                      "cover",
                    boxShadow:
                      "0 10px 30px rgba(99,102,241,.25)",
                  }}
                  width="140"
                  height="140"
                  alt="Profile"
                />

                {!viewOnly && (
                  <>
                    <button
                      className="btn position-absolute shadow"
                      style={{
                        bottom:
                          "5px",
                        right:
                          "5px",
                        background:
                          theme.primaryPurple,
                        color:
                          "#fff",
                        borderRadius:
                          "50%",
                        width:
                          "40px",
                        height:
                          "40px",
                      }}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <i className="bi bi-camera-fill"></i>
                    </button>

                    <input
                      type="file"
                      accept="image/*"
                      ref={
                        fileInputRef
                      }
                      onChange={
                        handleImageChange
                      }
                      style={{
                        display:
                          "none",
                      }}
                    />
                  </>
                )}
              </div>

              {viewOnly ? (
                <h3 className="fw-bold">
                  {user.name ||
                    "No name added"}
                </h3>
              ) : (
                <EditableField
                  value={
                    user.name
                  }
                  field="name"
                  onSave={
                    updateField
                  }
                  textClass="fw-bold justify-content-center fs-4"
                  inputClass="text-center"
                />
              )}

              <div className="text-muted mb-1">
                {user.email ||
                  "No email added"}
              </div>

              <div className="text-muted">
                {user.phone ||
                  "No phone added"}
              </div>

              {!viewOnly && (
                <button
                  className="btn w-100 mt-4 fw-bold"
                  style={{
                    background:
                      showMyFeed
                        ? "linear-gradient(135deg,#6366f1,#7c3aed)"
                        : "#eef2ff",
                    color:
                      showMyFeed
                        ? "#fff"
                        : theme.primaryPurple,
                    borderRadius:
                      "14px",
                    padding:
                      "12px",
                  }}
                  onClick={() =>
                    setShowMyFeed(
                      !showMyFeed
                    )
                  }
                >
                  <i className="bi bi-collection me-2"></i>
                  {showMyFeed
                    ? "Hide My Feed"
                    : "Show My Feed"}
                </button>
              )}
            </div>

            <ConnectedPeopleCard />

            {/* PERSONAL DETAILS */}

            {!viewOnly ? (
              <>
                <PersonalDetails
                  editedUser={
                    editedUser
                  }
                  setEditedUser={
                    setEditedUser
                  }
                  theme={theme}
                  updateField={
                    updateField
                  }
                  user={user}
                  setUser={setUser}
                />

                <Bio
                  user={user}
                  setUser={
                    setUser
                  }
                  theme={theme}
                  updateField={
                    updateField
                  }
                />

                <PreferredLanguage
                  languages={
                    languages
                  }
                  setLanguages={
                    setLanguages
                  }
                  saveLanguages={
                    saveLanguages
                  }
                  theme={theme}
                />

                <button
                  className="btn w-100 fw-bold shadow-sm py-3 mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg,#6366f1,#7c3aed)",
                    color:
                      "#fff",
                    borderRadius:
                      "14px",
                  }}
                  onClick={
                    handleProfileSave
                  }
                >
                  <i className="bi bi-check2-circle me-2"></i>
                  Save All Changes
                </button>
              </>
            ) : (
              <>
                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{
                    borderRadius:
                      "24px",
                  }}
                >
                  <h5 className="fw-bold mb-3">
                    Personal Details
                  </h5>

                  <p className="mb-2">
                    <small className="text-muted d-block">
                      Location
                    </small>
                    {user.location ||
                      "Not added"}
                  </p>

                  <p className="mb-2">
                    <small className="text-muted d-block">
                      Date of Birth
                    </small>
                    {formatDate(
                      user.dob
                    )}
                  </p>

                  <p className="mb-2">
                    <small className="text-muted d-block">
                      LinkedIn
                    </small>

                    {user.linkedin ? (
                      <a
                        href={
                          user.linkedin
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        View LinkedIn
                      </a>
                    ) : (
                      "Not added"
                    )}
                  </p>

                  <p className="mb-2">
                    <small className="text-muted d-block">
                      GitHub
                    </small>

                    {user.github ? (
                      <a
                        href={
                          user.github
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        View GitHub
                      </a>
                    ) : (
                      "Not added"
                    )}
                  </p>
                </div>

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{
                    borderRadius:
                      "24px",
                  }}
                >
                  <h5 className="fw-bold mb-3">
                    About
                  </h5>

                  <p className="text-muted mb-0">
                    {user.bio ||
                      user.about ||
                      "No bio added yet."}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="col-lg-8">

            {/* MY FEED */}

            {!viewOnly &&
              showMyFeed && (
                <MyFeedSection />
              )}

            {/* PROFILE SECTIONS */}

            {!viewOnly ? (
              <>
                <Skills
                  skills={skills}
                  setSkills={
                    setSkills
                  }
                  newSkill={
                    newSkill
                  }
                  setNewSkill={
                    setNewSkill
                  }
                  theme={theme}
                  availableSkills={
                    availableSkills
                  }
                  viewOnly={
                    viewOnly
                  }
                />

                <Education
                  education={
                    education
                  }
                  setEducation={
                    setEducation
                  }
                  newEdu={newEdu}
                  setNewEdu={
                    setNewEdu
                  }
                  theme={theme}
                  user={user}
                  viewOnly={
                    viewOnly
                  }
                />

                <Experience
                  experience={
                    experience
                  }
                  setExperience={
                    setExperience
                  }
                  theme={theme}
                  user={user}
                  viewOnly={
                    viewOnly
                  }
                />

                <Resume
                  user={user}
                  theme={theme}
                  setUser={
                    setUser
                  }
                  viewOnly={
                    viewOnly
                  }
                />
              </>
            ) : (
              <>
                {/* VIEW ONLY SKILLS */}

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{
                    borderRadius:
                      "24px",
                  }}
                >
                  <h5 className="fw-bold mb-3">
                    Skills
                  </h5>

                  {skills.length >
                  0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {skills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={
                              skill._id ||
                              index
                            }
                            className="badge rounded-pill"
                            style={{
                              background:
                                "#eef2ff",
                              color:
                                theme.primaryPurple,
                              padding:
                                "10px 14px",
                              fontSize:
                                "13px",
                            }}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            {getSkillName(
                              skill
                            )}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">
                      No skills
                      added.
                    </p>
                  )}
                </div>

                {/* VIEW ONLY EDUCATION */}

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{
                    borderRadius:
                      "24px",
                  }}
                >
                  <h5 className="fw-bold mb-3">
                    Education
                  </h5>

                  {education.length >
                  0 ? (
                    education.map(
                      (
                        edu,
                        index
                      ) => (
                        <div
                          key={
                            edu._id ||
                            index
                          }
                          className="p-3 mb-3 rounded-4"
                          style={{
                            background:
                              "#f8fafc",
                            borderLeft:
                              "4px solid #0ea5e9",
                          }}
                        >
                          <h6 className="fw-bold mb-1">
                            {edu.degree ||
                              "Degree not added"}
                          </h6>

                          <p className="text-muted mb-1">
                            {edu.institution ||
                              edu.institute ||
                              edu.school ||
                              edu.college ||
                              "Institution not added"}
                          </p>

                          <small className="text-muted">
                            {edu.year ||
                              edu.passing_year ||
                              edu.graduationYear ||
                              "Year not added"}
                          </small>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-muted mb-0">
                      No education
                      added.
                    </p>
                  )}
                </div>

                {/* VIEW ONLY EXPERIENCE */}

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{
                    borderRadius:
                      "24px",
                  }}
                >
                  <h5 className="fw-bold mb-3">
                    Experience
                  </h5>

                  {experience.length >
                  0 ? (
                    experience.map(
                      (
                        exp,
                        index
                      ) => (
                        <div
                          key={
                            exp._id ||
                            index
                          }
                          className="p-3 mb-3 rounded-4"
                          style={{
                            background:
                              "#f8fafc",
                            borderLeft:
                              "4px solid #6366f1",
                          }}
                        >
                          <h6 className="fw-bold mb-1">
                            {exp.role ||
                              "Role not added"}
                          </h6>

                          <p className="text-muted mb-1">
                            {exp.company_name ||
                              exp.company ||
                              "Company not added"}
                          </p>

                          <small className="text-muted">
                            {exp.start_date
                              ? formatDate(
                                  exp.start_date
                                )
                              : "Start date"}{" "}
                            -{" "}
                            {exp.end_date
                              ? formatDate(
                                  exp.end_date
                                )
                              : "Present"}
                          </small>

                          {exp.description && (
                            <p className="text-muted mt-2 mb-0">
                              {
                                exp.description
                              }
                            </p>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-muted mb-0">
                      No experience
                      added.
                    </p>
                  )}
                </div>

                {/* VIEW ONLY RESUME */}

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{
                    borderRadius:
                      "24px",
                  }}
                >
                  <h5 className="fw-bold mb-3">
                    Resume
                  </h5>

                  {getResumeLink() ? (
                    <a
                      href={
                        getResumeLink()
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="btn fw-bold"
                      style={{
                        background:
                          "linear-gradient(135deg,#6366f1,#7c3aed)",
                        color:
                          "#fff",
                        borderRadius:
                          "12px",
                      }}
                    >
                      <i className="bi bi-file-earmark-pdf me-2"></i>
                      View Resume
                    </a>
                  ) : (
                    <p className="text-muted mb-0">
                      No resume
                      uploaded.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// GET POSTS
export const getPosts = async () => {
  const res = await axios.get(`${API}/api/posts`, authHeader());
  return res.data.posts; // array return korche
};

// CREATE POST WITH IMAGE + TAG + MENTION
export const createPost = async (formData) => {
  const res = await axios.post(
    `${API}/api/posts`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.post;
};

// UPDATE POST
export const updatePost = async (
  postId,
  formData
) => {
  const res = await axios.put(
    `${API}/api/posts/${postId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.post;
};

// DELETE POST
export const deletePost = async (postId) => {
  const res = await axios.delete(
    `${API}/api/posts/${postId}`,
    authHeader()
  );

  return res.data;
};

// LIKE / UNLIKE POST
export const likePost = async (postId) => {
  const res = await axios.put(
    `${API}/api/posts/like/${postId}`,
    {},
    authHeader()
  );

  return res.data.post;
};

// COMMENT POST WITH MENTIONS
export const commentPost = async (
  postId,
  data
) => {
  const res = await axios.post(
    `${API}/api/posts/comment/${postId}`,
    data,
    authHeader()
  );

  return res.data.post;
};

// REPLY COMMENT WITH MENTIONS
export const replyComment = async (
  postId,
  commentId,
  data
) => {
  const res = await axios.post(
    `${API}/api/posts/reply/${postId}/${commentId}`,
    data,
    authHeader()
  );

  return res.data.post;
};

// LIKE COMMENT
export const likeComment = async (
  postId,
  commentId
) => {
  const res = await axios.put(
    `${API}/api/posts/comment-like/${postId}/${commentId}`,
    {},
    authHeader()
  );

  return res.data.post;
};

// LIKE REPLY
export const likeReply = async (
  postId,
  commentId,
  replyId
) => {
  const res = await axios.put(
    `${API}/api/posts/reply-like/${postId}/${commentId}/${replyId}`,
    {},
    authHeader()
  );

  return res.data.post;
};

export const getMyPosts = async () => {

  const res = await axios.get(
    `${API}/api/posts/my-posts`,
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return res.data.posts;

};
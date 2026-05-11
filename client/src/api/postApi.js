import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getPosts = async () => {
  const res = await axios.get(`${API}/api/posts`, authHeader());
  return res.data;
};

export const createPost = async (content) => {
  const res = await axios.post(
    `${API}/api/posts`,
    { content },
    authHeader()
  );

  return res.data;
};

export const deletePost = async (postId) => {
  const res = await axios.delete(
    `${API}/api/posts/${postId}`,
    authHeader()
  );

  return res.data;
};

export const updatePost = async (postId, content) => {
  const res = await axios.put(
    `${API}/api/posts/${postId}`,
    { content },
    authHeader()
  );

  return res.data;
};

export const likePost = async (postId) => {
  const res = await axios.put(
    `${API}/api/posts/like/${postId}`,
    {},
    authHeader()
  );

  return res.data;
};

export const commentPost = async (postId, text) => {
  const res = await axios.post(
    `${API}/api/posts/comment/${postId}`,
    { text },
    authHeader()
  );

  return res.data;
};
export const replyComment = async (
  postId,
  commentId,
  text
) => {
  const res = await axios.post(
    `${API}/api/posts/reply/${postId}/${commentId}`,
    { text },
    authHeader()
  );

  return res.data;
};

export const likeComment = async (
  postId,
  commentId
) => {
  const res = await axios.put(
    `${API}/api/posts/comment-like/${postId}/${commentId}`,
    {},
    authHeader()
  );

  return res.data;
};

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

  return res.data;
};
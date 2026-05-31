import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const searchUsers = async (query) => {
  const res = await axios.get(
    `${API}/api/profile-search/search?q=${encodeURIComponent(query)}`,
    authHeader()
  );

  return res.data.users || [];
};
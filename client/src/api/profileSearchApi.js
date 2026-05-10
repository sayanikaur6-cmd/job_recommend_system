import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const searchProfiles = async (query) => {
  const res = await axios.get(
    `${API}/api/profile-search/search?q=${query}`,
    authHeader()
  );
  return res.data;
};

export const getPublicProfile = async (userId) => {
  const res = await axios.get(
    `${API}/api/profile-search/${userId}`,
    authHeader()
  );
  return res.data;
};

export const sendConnectionRequest = async (receiverId) => {
  const res = await axios.post(
    `${API}/api/connections/send`,
    { receiverId },
    authHeader()
  );
  return res.data;
};
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getRecommendedJobs = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/api/recommendations/jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
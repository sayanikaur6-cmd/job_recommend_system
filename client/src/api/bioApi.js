import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const generateBioAPI = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_URL}/api/bio/generate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
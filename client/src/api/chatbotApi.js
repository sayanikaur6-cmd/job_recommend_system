import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const sendChatMessage = async (message) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/api/chatbot/message`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
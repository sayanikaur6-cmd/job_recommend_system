import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const sendConnectionRequest = async (receiverId) => {
  const res = await axios.post(
    `${API}/api/connections/send`,
    { receiverId },
    authHeader()
  );

  return res.data;
};

export const getReceivedRequests = async () => {
  const res = await axios.get(
    `${API}/api/connections/received`,
    authHeader()
  );

  return res.data.requests || [];
};

export const getSentRequests = async () => {
  const res = await axios.get(
    `${API}/api/connections/sent`,
    authHeader()
  );

  return res.data.requests || [];
};

export const acceptConnectionRequest = async (connectionId) => {
  const res = await axios.put(
    `${API}/api/connections/accept/${connectionId}`,
    {},
    authHeader()
  );

  return res.data;
};

export const rejectConnectionRequest = async (connectionId) => {
  const res = await axios.put(
    `${API}/api/connections/reject/${connectionId}`,
    {},
    authHeader()
  );

  return res.data;
};

export const getConnectedPeople = async () => {
  const res = await axios.get(
    `${API}/api/connections/connected`,
    authHeader()
  );

  return res.data.people || [];
};
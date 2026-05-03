import axios from "axios";

const API = "http://localhost:5000/api/education";

const getToken = () => localStorage.getItem("token");

export const getEducations = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  return res.data.education;
};

export const addEducation = async (data) => {
  const res = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.education;
};

export const updateEducation = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.education;
};

export const deleteEducation = async (id) => {
  const res = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getUserProfile = (id) =>
  API.get(`/user/profile/${id}`);

export const updateUserProfile = (id, data) =>
  API.put(`/user/profile/${id}`, data);
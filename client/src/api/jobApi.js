import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getJobs = () => API.get("/api/jobs");
export const createJob = (data) => API.post("/api/jobs", data);
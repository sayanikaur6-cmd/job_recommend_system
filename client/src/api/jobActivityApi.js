import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const saveJob = async (jobId) => {
  const res = await axios.post(
    `${API}/api/job-activity/save`,
    { jobId },
    authHeader()
  );

  return res.data;
};

export const unsaveJob = async (jobId) => {
  const res = await axios.delete(
    `${API}/api/job-activity/save/${jobId}`,
    authHeader()
  );

  return res.data;
};

export const getSavedJobs = async () => {
  const res = await axios.get(
    `${API}/api/job-activity/saved`,
    authHeader()
  );

  return res.data.jobs || [];
};

export const applyJob = async (jobId) => {
  const res = await axios.post(
    `${API}/api/job-activity/apply`,
    { jobId },
    authHeader()
  );

  return res.data;
};

export const getApplications = async () => {
  const res = await axios.get(
    `${API}/api/job-activity/applications`,
    authHeader()
  );

  return res.data.applications || [];
};

export const updateApplicationStatus = async (id, data) => {
  const res = await axios.put(
    `${API}/api/job-activity/applications/${id}`,
    data,
    authHeader()
  );

  return res.data;
};
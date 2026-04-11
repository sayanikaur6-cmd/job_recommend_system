import axios from "axios";

const BASE_URL = "http://localhost:5000/api/jobs";

export const searchJobs = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}`
    );

    return response.data;
  } catch (error) {
    console.error("Search API Error:", error);
    throw error;
  }
};
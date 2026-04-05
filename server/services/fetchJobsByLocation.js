const axios = require("axios");

async function fetchJobsByLocation(location) {
  try {
    if (!location) return [];

    const response = await axios.get(
      "https://api.openwebninja.com/jsearch/search",
      {
        params: {
          query: `jobs in ${location}`,
          page: "1",
          num_pages: "1",
          country: "in"
        },
        headers: {
          "X-Api-Key": process.env.RAPIDAPI_KEY // ✅ FIXED
        }
      }
    );
    console.log("API KEY:", process.env.RAPIDAPI_KEY);
    return response?.data?.data || [];

  } catch (error) {
    console.error("Job API Error:", error.response?.data || error.message);
    return [];
  }
}

module.exports = fetchJobsByLocation;
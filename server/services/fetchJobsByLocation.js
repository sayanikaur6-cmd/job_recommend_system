
const axios = require("axios");

/**
 * Fetch jobs from RapidAPI JSearch based on state/city
 * @param {string} location - city or state name
 * @returns {Array} jobs data
 */
async function fetchJobsByLocation(location) {
  try {
    const response = await axios.get(
      "https://jsearch.p.rapidapi.com/search",
      {
        params: {
          query: `jobs in ${location}`, // dynamic location
          page: "1",
          num_pages: "1",
          date_posted: "all",
          country: "in"
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "jsearch.p.rapidapi.com"
        }
      }
    );

    // response.data.data contains array of job listings
    return response.data.data;

  } catch (error) {
    console.error(error.response?.data || error.message);
    return []; // fail-safe
  }
}

module.exports = fetchJobsByLocation;
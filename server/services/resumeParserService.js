const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const API_URL =
  process.env.RESUME_PARSER_API_URL ||
  "https://api-production-319c.up.railway.app/v1/extract";

const API_KEY =
  process.env.RESUME_PARSER_API_KEY ||
  "YOUR_API_KEY";

const parseResumeFile = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Resume file not found.");
    }

    const formData = new FormData();

    formData.append(
      "file",
      fs.createReadStream(filePath)
    );

    formData.append(
      "options",
      JSON.stringify({
        async: false,
      })
    );

    const response = await axios.post(
      API_URL,
      formData,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          ...formData.getHeaders(),
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 60000,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Resume Parser Error:");
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);

      throw new Error(
        typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response.data
      );
    }

    throw error;
  }
};

module.exports = {
  parseResumeFile,
};
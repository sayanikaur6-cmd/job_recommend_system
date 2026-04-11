const Job = require("../models/job");
const fetchJobsByLocation = require("../services/fetchJobsByLocation");
const axios = require("axios");
// CREATE
exports.createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
};

// READ ALL
exports.getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

// UPDATE
exports.updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(job);
};

// DELETE
exports.deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
};
exports.getJobloc = async (req, res) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({ message: "State is required" });
    }

    const jobs = await fetchJobsByLocation(state);

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.searchJobs = async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(
      "https://jsearch.p.rapidapi.com/search",
      {
        params: {
          query: query || "developer jobs",
          page: "1",
          num_pages: "1",
          country: "in",
          date_posted: "all"
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "jsearch.p.rapidapi.com"
        }
      }
    );

    res.json(response.data.data);

  } catch (error) {
    console.log("KEY:", process.env.RAPIDAPI_KEY);
    console.error("Search Job Error:", error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
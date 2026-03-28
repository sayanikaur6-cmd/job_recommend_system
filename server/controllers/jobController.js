const Job = require("../models/job");
const fetchJobsByLocation = require("../services/fetchJobsByLocation");
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
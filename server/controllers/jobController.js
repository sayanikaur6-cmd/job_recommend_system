const Job = require("../models/job");

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
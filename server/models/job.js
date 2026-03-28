const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  skills: [String],
  salary: String
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
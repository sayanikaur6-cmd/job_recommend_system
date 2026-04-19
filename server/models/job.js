const mongoose = require("mongoose");
const { mainDB } = require("../config/db");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  skills: [String],
  salary: String
}, { timestamps: true });

module.exports = mainDB.model("Job", jobSchema);
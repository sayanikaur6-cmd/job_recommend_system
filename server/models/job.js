const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  job_id: {
    type: String,
    required: true,
    unique: true
  },

  title: String,

  company: String,

  company_logo: String,

  company_website: String,

  publisher: String,

  employment_type: String,

  employment_types: [String],

  apply_link: String,

  apply_options: [
    {
      apply_link: String,
      is_direct: Boolean,
      publisher: String
    }
  ],

  description: String,

  is_remote: Boolean,

  posted_at: String,

  posted_timestamp: Number,

  posted_date: Date,

  location: String,

  city: String,

  state: String,

  country: String,

  latitude: Number,

  longitude: Number,

  salary: String,

  min_salary: Number,

  max_salary: Number,

  salary_period: String,

  benefits: [String],

  highlights: Object,

  // 🔥 AI Recommendation er jonno IMPORTANT
  skills: [String],

}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
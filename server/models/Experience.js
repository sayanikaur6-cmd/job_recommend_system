const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company_name: {
      type: String,
      required: true,
      trim: true,
    },
    emp_type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
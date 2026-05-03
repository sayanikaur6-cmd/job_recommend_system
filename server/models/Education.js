const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  degree: String,
  institution: String,
  year: String,
  grade: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Education", educationSchema);
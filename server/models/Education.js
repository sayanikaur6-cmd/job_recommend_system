const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  degree: String,
  college: String,
  year: String,
});

module.exports = mongoose.model("Education", educationSchema);
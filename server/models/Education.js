const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  degree: String,
  institute: String,
  startyear: String,
  endyear: String,
});

module.exports = mongoose.model("Education", educationSchema);
const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

module.exports = mongoose.model("Skill", skillSchema);
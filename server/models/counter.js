const mongoose = require("mongoose");
const { mainDB } = require("../config/db");
const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

module.exports = mainDB.model("Counter", counterSchema);
// models/Message.js
const mongoose = require("mongoose");
const { chatDB } = require("../config/db");

const messageSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  receiver: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 Auto delete after 60 days
messageSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 60 }
);

module.exports = chatDB.model("Message", messageSchema);
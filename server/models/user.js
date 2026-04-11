const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password_hash: {
    type: String,
    default: null   // 🔥 important change
  },

  googleId: {
    type: String,
    default: null   // 🔥 new field
  },

  photo: {
    type: String,
    default: null
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  preferences: {
    type: Object,
    default: {}
  },

  login_history: [
    {
      login_at: { type: Date, default: Date.now },
      ip: String,
      device: String
    }
  ]
}, { timestamps: true }); // automatically adds createdAt & updatedAt



module.exports = mongoose.model("User", userSchema);
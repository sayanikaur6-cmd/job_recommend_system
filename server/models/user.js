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
    default: null
  },

  googleId: {
    type: String,
    default: null
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
  ],

  // 🔥 NEW FIELDS START HERE

  phone: {
    type: String,
    default: ""
  },

  location: {
    type: String,
    default: ""
  },

  skills: {
    type: [String],
    default: []
  },

  education: {
    type: String,
    default: ""
  },

  experience: {
    type: String,
    default: ""
  },

  preferredRole: {
  type: [String],   // 🔥 array
  default: []
},

  bio: {
    type: String,
    default: ""
  },

  linkedin: {
    type: String,
    default: ""
  },

  github: {
    type: String,
    default: ""
  },

  // 🔥 FILE STORAGE

  profilePic: {
    type: String,
    default: ""
  },

  resume: {
    type: String,
    default: ""
  },

  documents: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
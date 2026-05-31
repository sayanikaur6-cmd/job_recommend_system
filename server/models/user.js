const mongoose = require("mongoose");
const User = require("../models/User");
const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password_hash: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    photo: {
      type: String,
      default: null,
    },

    jobAlertEmailCount: {
      type: Number,
      default: 0,
    },

    jobAlertEmailDate: {
      type: Date,
      default: null,
    },

    lastJobAlertSentAt: {
      type: Date,
      default: null,
    },
    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    preferences: {
      type: Object,
      default: {},
    },

    login_history: [
      {
        login_at: { type: Date, default: Date.now },
        ip: String,
        device: String,
      },
    ],

    // 🔥 NEW FIELDS START HERE

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    otp: {
      type: String,
      default: null,
    },

    otp_expiry: {
      type: Date,
      default: null,
    },

    preferredRole: {
      type: [String], // 🔥 array
      default: [],
    },

    bio: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },
    dob: { type: String },
    // 🔥 FILE STORAGE

    profilePic: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    documents: {
      type: String,
      default: "",
    },
    languages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

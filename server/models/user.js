const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true // auto-incremented field
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
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  preferences: {
    type: Object, // optional: store JSON preferences
    default: {}
  },
  login_history: [
    {
      login_at: { type: Date, default: Date.now },
      ip: String,
      device: String
    }
  ],
   otp: {
    type: String,
    default: null
  },

  otp_expiry: {
    type: Date,
    default: null
  }
}, { timestamps: true }); // automatically adds createdAt & updatedAt



module.exports = mongoose.model("User", userSchema);
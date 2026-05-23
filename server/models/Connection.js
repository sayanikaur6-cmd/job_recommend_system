const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    primary_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    secondary_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requested_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    date_of_request: {
      type: Date,
      default: Date.now,
    },

    date_of_connection: {
      type: Date,
      default: null,
    },

    rejected_at: {
      type: Date,
      default: null,
    },

    blocked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    removed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    active: {
      type: Boolean,
      default: true,
    },

    active_change_date: {
      type: Date,
      default: null,
    },

    last_interaction_at: {
      type: Date,
      default: Date.now,
    },

    is_muted: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      enum: ["search", "profile", "suggestion"],
      default: "profile",
    },
  },
  {
    timestamps: true,
  }
);

// duplicate connection block
connectionSchema.index(
  {
    primary_user: 1,
    secondary_user: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Connection", connectionSchema);
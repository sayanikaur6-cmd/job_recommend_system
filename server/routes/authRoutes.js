const express = require("express");
const router = express.Router();
const {
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require("../controllers/authController");

// 🔐 Login
router.post("/login", loginUser);

// 🔑 Forgot Password (OTP send)
router.post("/forgot-password", forgotPassword);

// ✅ Verify OTP
router.post("/verify-otp", verifyOTP);

// 🔄 Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
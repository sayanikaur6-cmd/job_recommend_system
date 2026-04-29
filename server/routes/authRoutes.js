const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  googleCallback 
} = require("../controllers/authController");

// 🔐 Login
router.post("/login", loginUser);

// 🔑 Forgot Password (OTP send)
router.post("/forgot-password", forgotPassword);

// ✅ Verify OTP
router.post("/verify-otp", verifyOTP);

// 🔄 Reset Password
router.post("/reset-password", resetPassword);
// 🔹 Google Login Start
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// 🔹 Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }),
  googleCallback // ✅ controller call
);

// 🔹 Get user
router.get("/me", (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json(req.user);
});
module.exports = router;
const express = require("express");
const passport = require("passport");
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

// 🔑 Forgot Password (OTP send)
router.post("/forgot-password", forgotPassword);

// ✅ Verify OTP
router.post("/verify-otp", verifyOTP);

// 🔄 Reset Password
router.post("/reset-password", resetPassword);
router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// 🔹 Callback
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  async (req, res) => {

    // 🔥 login history save
    req.user.login_history.push({
      ip: req.ip,
      device: req.headers["user-agent"]
    });

    await req.user.save();

    res.redirect(process.env.FRONTEND_URL + "/");
  }
);

// 🔹 Get user
router.get("/me", (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json(req.user);
});
module.exports = router;
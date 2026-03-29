const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===========================
// LOGIN USER
// ===========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 1. Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 🔹 2. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔹 4. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        user_id: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
    );

    // 🔹 5. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
};
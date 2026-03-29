const User = require("../models/user");
const bcrypt = require("bcryptjs");
const getNextSequence = require("../utils/getNextSequence"); // 👈 add this

// ===========================
// Create new user
// ===========================
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, preferences } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 🔥 Get auto-increment user_id
    const user_id = await getNextSequence("user_id");

    const newUser = new User({
      user_id, // 👈 add this line
      name,
      email,
      password_hash,
      role: role || "user",
      preferences: preferences || {}
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
};

// ===========================
// Read all users
// ===========================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ user_id: 1 }); // sort by user_id
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// ===========================
// Read single user by ID
// ===========================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// ===========================
// Update user by ID
// ===========================
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role, preferences } = req.body;

    const updateData = { name, email, role, preferences };

    // If password is updated, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: req.params.id },
      { $set: updateData },
      { new: true } // return updated document
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// ===========================
// Delete user by ID
// ===========================
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ user_id: req.params.id });
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const getNextSequence = require("../utils/getNextSequence"); // 👈 add this
const { sendEmail } = require("../utils/emailService");

// ===========================
// Create new user
// ===========================
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, preferences } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Auto increment ID
    const user_id = await getNextSequence("user_id");

    const newUser = new User({
      user_id,
      name,
      email,
      password_hash,
      role: role || "user",
      preferences: preferences || {}
    });

    await newUser.save();

    // 📧 Send Email (non-blocking safe way)
    sendEmail({
      to: email,
      subject: "Welcome 🎉",
      html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f7f9; padding: 20px;">
              
              <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: #4CAF50; padding: 20px; text-align: center; color: white;">
                  <h1 style="margin: 0;">Welcome 🎉</h1>
                </div>

                <!-- Body -->
                <div style="padding: 30px; text-align: center;">
                  <h2 style="color: #333;">Hello ${name},</h2>
                  <p style="color: #555; font-size: 16px;">
                    Your account has been created successfully.
                  </p>

                  <p style="color: #777; font-size: 14px;">
                    We're excited to have you onboard 🚀
                  </p>

                  <!-- Button -->
                  <a href="http://localhost:5173"
                    style="display: inline-block; margin-top: 20px; padding: 12px 25px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                    Go to Dashboard
                  </a>
                </div>

                <!-- Footer -->
                <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                  <p style="margin: 0;">© 2026 Your App. All rights reserved.</p>
                </div>

              </div>
            </div>
            `
    });

    res.status(201).json({
      message: "User created successfully & email sent",
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
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      education: req.body.education,
      experience: req.body.experience,
      preferredRole: req.body.preferredRole,
      bio: req.body.bio,
      linkedin: req.body.linkedin,
      github: req.body.github,
    };

    // skills string → array
    if (req.body.skills) {
      updateData.skills = JSON.parse(req.body.skills);
    }

    // FILES HANDLE
    if (req.files?.profilePhoto) {
      updateData.profilePic = req.files.profilePhoto[0].filename;
    }

    if (req.files?.resume) {
      updateData.resume = req.files.resume[0].filename;
    }

    if (req.files?.documents) {
      updateData.documents = req.files.documents[0].filename;
    }
  if (req.files?.profilePhoto) {
  updateData.profilePic = `/uploads/profile/${req.files.profilePhoto[0].filename}`;
}

if (req.files?.resume) {
  updateData.resume = `/uploads/resume/${req.files.resume[0].filename}`;
}

if (req.files?.documents) {
  updateData.documents = `/uploads/documents/${req.files.documents[0].filename}`;
}
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const getNextSequence = require("../utils/getNextSequence"); // 👈 add this
const { sendEmail } = require("../utils/emailService");
const Skill = require("../models/Skill");
const Experience = require("../models/Experience"); // Adjust path as needed
const Education = require("../models/Education"); // Adjust path as needed
const fs = require("fs");
const path = require("path");
const { parseResumeFile } = require("../services/resumeParserService");
const parseToDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const cleaned = dateStr.trim().toLowerCase();
  if (cleaned === "current" || cleaned === "present") return null;

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};
const getValueAtIndex = (val, index) => {
  if (Array.isArray(val)) {
    const item = val[index] !== undefined ? val[index] : val[0];
    return item ? String(item) : "";
  }
  return val ? String(val) : "";
};
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
    const user = await User.findById(req.user.id).select("-password").populate("skills");
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
exports.updateSingleField = async (req, res) => {
  try {
    // console.log("REQ.USER:", req.user); // 🔥 DEBUG

    const userId = req.user?._id || req.user?.id; // 🔥 FIX

    const { field, value } = req.body;

    const allowedFields = [
      "name",
      "phone",
      "email",
      "bio",
      "location",
      "dob",
      "linkedin",
      "github",
      "languages",
    ];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: value },
      { new: true }
    );

    // console.log("UPDATED:", updatedUser);

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating field" });
  }
};
exports.setProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 🔹 find user first (old image delete করার জন্য)
    const user = await User.findById(userId);

    // 🔥 old profile picture delete (if exists)
    if (user?.profilePic) {
      const oldPath = path.join(__dirname, "..", user.profilePic);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // 🔹 dynamic path (OS safe)
    const profilePicPath = `/${req.file.path.replace(/\\/g, "/")}`;

    // 🔹 update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicPath },
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// add skills to profile
exports.addSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingSkills = user.skills || [];

    user.skills = [...new Set([...existingSkills, ...skills])];

    await user.save();

    res.json({
      message: "Skills added successfully",
      skills: user.skills
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.removeSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.skills = user.skills.filter(s => !skills.includes(s.toString()));
    await user.save();
    res.json({
      message: "Skills removed successfully",
      skills: user.skills
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🔥 UPLOAD RESUME CONTROLLER
exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/resume/${req.file.filename}`;

    // 1. Parser Call
    const parsedResult = await parseResumeFile(req.file.path);
    console.log("Parsed Resume Result:", parsedResult);

    const data = parsedResult?.data || parsedResult || {};

    // ----------------------------------------------------
    // 2. Map Basic User Profile Fields
    // ----------------------------------------------------
    const updateFields = {
      resume: filePath,
    };

    if (data.candidate_name) updateFields.name = data.candidate_name;
    if (data.phone) updateFields.phone = data.phone;
    if (data.address || data.city) {
      updateFields.location = data.address || data.city;
    }
    if (data.summary) updateFields.bio = data.summary;

    if (data.job_title) {
      updateFields.preferredRole = Array.isArray(data.job_title)
        ? data.job_title
        : [data.job_title];
    } else if (data.professional_title) {
      updateFields.preferredRole = [data.professional_title];
    }

    if (data.language) {
      updateFields.languages = Array.isArray(data.language)
        ? data.language
        : [data.language];
    }

    // ----------------------------------------------------
    // 3. Process Skills (Upsert & Collect ObjectIds)
    // ----------------------------------------------------
    let rawSkills = [];

    if (Array.isArray(data.skill_name)) {
      rawSkills.push(...data.skill_name);
    } else if (typeof data.skill_name === "string") {
      rawSkills.push(data.skill_name);
    }

    if (Array.isArray(data.skills)) {
      rawSkills.push(...data.skills);
    } else if (typeof data.skills === "string") {
      const splitSkills = data.skills.split(/;|,|\n/).map((s) => s.trim());
      rawSkills.push(...splitSkills);
    }

    const cleanSkills = [
      ...new Set(
        rawSkills
          .map((s) => s?.trim())
          .filter((s) => s && !s.toLowerCase().includes("lorem ipsum"))
      ),
    ];

    const skillIds = [];
    if (cleanSkills.length > 0) {
      for (const skillName of cleanSkills) {
        const skillDoc = await Skill.findOneAndUpdate(
          { skill: skillName },
          { skill: skillName },
          { upsert: true, new: true, runValidators: true }
        );
        skillIds.push(skillDoc._id);
      }
      updateFields.skills = skillIds;
    }

    // ----------------------------------------------------
    // 4. Process Experience Entries
    // ----------------------------------------------------
    const experiencesToInsert = [];

    if (Array.isArray(data.employer)) {
      data.employer.forEach((company, index) => {
        experiencesToInsert.push({
          user_id: userId,
          company_name: String(company),
          role: getValueAtIndex(data.job_title, index) || "Role",
          start_date:
            parseToDate(getValueAtIndex(data.employment_start_date, index)) ||
            new Date(),
          end_date: parseToDate(
            getValueAtIndex(data.employment_end_date, index)
          ),
          description: getValueAtIndex(data.work_description, index),
          location: getValueAtIndex(data["employer.city"], index),
        });
      });
    } else if (data.employer) {
      experiencesToInsert.push({
        user_id: userId,
        company_name: String(data.employer),
        role:
          getValueAtIndex(data.job_title, 0) ||
          data.professional_title ||
          "Role",
        start_date: parseToDate(data.employment_start_date) || new Date(),
        end_date: parseToDate(data.employment_end_date),
        description:
          getValueAtIndex(data.job_description, 0) || data.experience || "",
        location: getValueAtIndex(data["employer.city"], 0),
      });
    } else if (data.experience && !data.experience.includes("Lorem Ipsum")) {
      experiencesToInsert.push({
        user_id: userId,
        company_name: "Previous Experience",
        role: data.professional_title || "Role",
        start_date: parseToDate(data.employment_start_date) || new Date(),
        end_date: parseToDate(data.employment_end_date),
        description: String(data.experience),
      });
    }

    // ----------------------------------------------------
    // 5. Process Education Entries (FIXED FOR ARRAY CASTING ISSUE)
    // ----------------------------------------------------
    const educationsToInsert = [];

    if (Array.isArray(data.degree) || Array.isArray(data.institution)) {
      const degrees = Array.isArray(data.degree) ? data.degree : [data.degree];
      const institutions = Array.isArray(data.institution)
        ? data.institution
        : [data.institution];

      const count = Math.max(degrees.length, institutions.length);

      for (let i = 0; i < count; i++) {
        // Extract raw year field (can be array or string)
        const rawYear =
          data.education_period ||
          data.graduation_year ||
          data.expected_graduation_date ||
          "";

        // Extract raw location field
        const rawLocation =
          data["institution.city"] || data["institution.location"] || "";

        // Extract raw description field
        const rawDesc =
          data.relevant_coursework || data.academic_project_description || "";

        educationsToInsert.push({
          userId: userId,
          degree: getValueAtIndex(degrees, i) || "Degree",
          institution: getValueAtIndex(institutions, i) || "Institution",
          year: getValueAtIndex(rawYear, i),
          location: getValueAtIndex(rawLocation, i),
          description: getValueAtIndex(rawDesc, i),
        });
      }
    } else if (data.degree || data.institution) {
      const rawYear =
        data.graduation_year ||
        data.expected_graduation_date ||
        data.education_period ||
        "";

      const rawLocation =
        data["institution.city"] || data["institution.location"] || "";

      const rawDesc =
        data.relevant_coursework || data.academic_project_description || "";

      educationsToInsert.push({
        userId: userId,
        degree: getValueAtIndex(data.degree, 0) || "Degree",
        institution: getValueAtIndex(data.institution, 0) || "Institution",
        year: getValueAtIndex(rawYear, 0),
        location: getValueAtIndex(rawLocation, 0),
        description: getValueAtIndex(rawDesc, 0),
      });
    }

    // ----------------------------------------------------
    // 6. DB Updates Execution
    // ----------------------------------------------------
    await Promise.all([
      Experience.deleteMany({ user_id: userId }),
      Education.deleteMany({ userId: userId }),
    ]);

    const [updatedUser] = await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { returnDocument: "after", runValidators: true }
      ),
      experiencesToInsert.length > 0
        ? Experience.insertMany(experiencesToInsert)
        : Promise.resolve(),
      educationsToInsert.length > 0
        ? Education.insertMany(educationsToInsert)
        : Promise.resolve(),
    ]);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Resume processed and profile updated successfully",
      user: updatedUser,
      insertedExperiences: experiencesToInsert.length,
      insertedEducations: educationsToInsert.length,
    });
  } catch (err) {
    console.error("MongoDB Update Error details:", err);
    return res.status(500).json({
      message: "Upload failed",
      error: err.message,
    });
  }
};
exports.deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { resume: "" },
      { returnDocument: "after" }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
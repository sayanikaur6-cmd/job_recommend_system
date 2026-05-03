const User = require("../models/user");
const Education = require("../models/Education");

// ADD education
exports.addEducation = async (req, res) => {
  try {
    const education = await Education.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Education added successfully",
      education,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET logged in user's education
exports.getEducation = async (req, res) => {
  try {
    const education = await Education.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      education,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE education
exports.updateEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      education,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE education
exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Experience = require("../models/Experience");

// Add experience
exports.addExperience = async (req, res) => {
  try {
    const {
      user_id,
      role,
      company_name,
      emp_type,
      location,
      start_date,
      end_date,
      description,
    } = req.body;

    const experience = await Experience.create({
      user_id,
      role,
      company_name,
      emp_type,
      location,
      start_date,
      end_date: end_date || null,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Experience added successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's all experiences
exports.getExperiencesByUser = async (req, res) => {
  try {
    const experiences = await Experience.find({
      user_id: req.params.user_id,
    }).sort({ start_date: -1 });

    res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update experience
exports.updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete experience
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
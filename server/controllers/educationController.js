const User = require("../models/user");
const Education = require("../models/Education");
exports.addEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { degree, institute, startyear, endyear } = req.body; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const education = new Education({
      userId,
      degree,
        institute,
        startyear,
        endyear
    });
    await education.save();
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });   
    }
};
exports.getEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const education = await Education.find({ userId });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
   }
};
exports.deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    await Education.findByIdAndDelete(id);
    res.json({ message: "Education entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};
exports.updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, institute, startyear, endyear } = req.body; 
    const updatedEducation = await Education.findByIdAndUpdate(
        id,
        { degree, institute, startyear, endyear },
        { new: true }
    );
    if (!updatedEducation) {
      return res.status(404).json({ message: "Education entry not found" });
    }
    res.json(updatedEducation);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};
exports.getEducationById = async (req, res) => {
  try {
    const { id } = req.params;
    const education = await Education.findById(id);
    if (!education) {
      return res.status(404).json({ message: "Education entry not found" });
    }
    res.json(education);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

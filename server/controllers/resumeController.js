const PDFDocument = require("pdfkit");
const User = require("../models/user");
const Experience = require("../models/Experience");
const Education = require("../models/Education");
// generatePeachResume, generateMinimalResume, generateBlackResume import from uttils/genResume.js
const {
  generatePeachResume,
  generateMinimalResume,
  generateBlackResume
} = require("../utils/genResume");
 
// Education, Skills thakle import kor

exports.generateResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { templateId } = req.params;

    const user = await User.findById(userId)
      .populate("skills");
      // experiene and education for the user
      const education = await Education.find({ userId: userId });
      const experience = await Experience.find({ user_id: userId });

      const fullUser = {
        ...user.toObject(),
        education,
        experience
      };
      // const user= fullUser;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["peach", "minimal", "black"].includes(templateId)) {
      return res.status(400).json({ message: "Invalid template" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user.name || "resume"}-${templateId}.pdf`
    );

    if (templateId === "peach") {
      return generatePeachResume(fullUser, res);
    }

    if (templateId === "minimal") {
      return generateMinimalResume(fullUser, res);
    }

    if (templateId === "black") {
      return generateBlackResume(fullUser, res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resume generate failed" });
  }
};
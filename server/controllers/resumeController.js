const PDFDocument = require("pdfkit");
const User = require("../models/user");
const Experience = require("../models/Experience");
// Education, Skills thakle import kor

exports.generateResume = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findById(user_id);
    const experiences = await Experience.find({ user_id });

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume.pdf`
    );

    doc.pipe(res);

    // 🧠 HEADER
    doc.fontSize(20).text(user.name, { bold: true });
    doc.fontSize(12).text(user.email);
    doc.moveDown();

    // 🧠 EXPERIENCE
    doc.fontSize(16).text("Experience", { underline: true });

    experiences.forEach((exp) => {
      doc
        .fontSize(12)
        .text(`${exp.role} - ${exp.company_name}`);
      doc
        .fontSize(10)
        .text(
          `${exp.start_date?.toDateString()} - ${
            exp.end_date
              ? exp.end_date.toDateString()
              : "Present"
          }`
        );
      doc.text(exp.description || "");
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
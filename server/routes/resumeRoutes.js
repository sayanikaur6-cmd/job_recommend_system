const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadResume } = require("../controllers/userController");
const { generateResume } = require("../controllers/resumeController");
const auth = require("../middleware/auth");

// Configure local temporary file storage for uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if ([".pdf", ".doc", ".docx"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC and DOCX files are allowed."));
    }
  },
});

router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadResume
);
router.get("/generate/:templateId", auth, generateResume);

module.exports = router;
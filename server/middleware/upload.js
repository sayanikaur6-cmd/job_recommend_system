const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔥 folder mapping
const folderMap = {
  profilePhoto: "uploads/profile",
  resume: "uploads/resume",
  documents: "uploads/documents",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = folderMap[file.fieldname] || "uploads/misc";

    // 🔥 auto create folder if not exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
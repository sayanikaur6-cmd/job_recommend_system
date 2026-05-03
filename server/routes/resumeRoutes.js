const express = require("express");
const router = express.Router();
const { generateResume } = require("../controllers/resumeController");
const auth = require("../middleware/auth");

router.get("/generate/:templateId", auth, generateResume);

module.exports = router;
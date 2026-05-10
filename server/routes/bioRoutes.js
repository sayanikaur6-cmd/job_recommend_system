const express = require("express");
const router = express.Router();

const { generateBio } = require("../controllers/bioController");
const authMiddleware = require("../middleware/auth");

router.get("/generate", authMiddleware, generateBio);

module.exports = router;
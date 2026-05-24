const express = require("express");
const router = express.Router();

const {
  searchProfiles,
  getPublicProfile,
} = require("../controllers/profileSearchController");

const authMiddleware = require("../middleware/auth");

router.get("/search", authMiddleware, searchProfiles);
router.get("/:userId", authMiddleware, getPublicProfile);
module.exports = router;
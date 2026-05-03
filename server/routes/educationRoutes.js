const express = require("express");
const router = express.Router();

const {
  addEducation,
  getEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");

const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, addEducation);
router.get("/", authMiddleware, getEducation);
router.put("/:id", authMiddleware, updateEducation);
router.delete("/:id", authMiddleware, deleteEducation);

module.exports = router;
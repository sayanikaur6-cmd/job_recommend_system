const express = require("express");
const router = express.Router();

const {
  addExperience,
  getExperiencesByUser,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

router.post("/", addExperience);
router.get("/:user_id", getExperiencesByUser);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);

module.exports = router;
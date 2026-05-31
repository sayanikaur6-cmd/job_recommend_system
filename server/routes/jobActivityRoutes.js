const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  saveJob,
  unsaveJob,
  getSavedJobs,
  applyJob,
  getApplications,
  updateApplicationStatus,
} = require("../controllers/jobActivityController");

router.post("/save", authMiddleware, saveJob);
router.delete("/save/:jobId", authMiddleware, unsaveJob);
router.get("/saved", authMiddleware, getSavedJobs);

router.post("/apply", authMiddleware, applyJob);
router.get("/applications", authMiddleware, getApplications);
router.put("/applications/:id", authMiddleware, updateApplicationStatus);

module.exports = router;
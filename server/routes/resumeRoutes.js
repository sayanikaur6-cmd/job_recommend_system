const express = require("express");
const router = express.Router();

const { generateResume } = require("../controllers/resumeController");

router.get("/:user_id", generateResume);

module.exports = router;
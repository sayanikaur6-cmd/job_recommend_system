const authMiddleware = require("../middleware/auth");
// router
const express = require("express");
const router = express.Router();

// controller
const connectionController = require("../controllers/connectionController");

router.post("/send", authMiddleware, connectionController.sendConnectionRequest);
module.exports = router;
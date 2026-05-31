const express = require("express");
const router = express.Router();

const chatbotController = require("../controllers/chatbotController");
const authMiddleware = require("../middleware/auth");

router.post("/message", authMiddleware, chatbotController.chatMessage);

module.exports = router;
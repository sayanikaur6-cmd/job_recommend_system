const authMiddleware = require("../middleware/auth");
// router
const express = require("express");
const router = express.Router();

// controller
const connectionController = require("../controllers/connectionController");

router.post("/send", authMiddleware, connectionController.sendConnectionRequest);
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  sendConnectionRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  getConnectedPeople,
} = require("../controllers/connectionController");

router.post("/send", authMiddleware, sendConnectionRequest);

router.get("/received", authMiddleware, getReceivedRequests);

router.get("/sent", authMiddleware, getSentRequests);

router.put("/accept/:connectionId", authMiddleware, acceptRequest);

router.put("/reject/:connectionId", authMiddleware, rejectRequest);

router.get("/connected", authMiddleware, getConnectedPeople);

module.exports = router;
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const verifyToken = require("../middleware/auth");

// 🔥 NEW IMPORTS
const upload = require("../middleware/upload");
const { updateProfile } = require("../controllers/userController");
// const authMiddleware = require("../middleware/auth");

// Create
router.post("/", userController.createUser);

// Read
router.get("/", userController.getAllUsers);

// ✅ PROFILE (must be before :id)
router.get("/profile", verifyToken, userController.getProfile);

// Update Profile (WITH FILE UPLOAD)
router.put(
  "/profile",
  verifyToken,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "documents", maxCount: 1 },
  ]),
  updateProfile
);

// Other routes
router.get("/:id", userController.getUserById);
router.put("/update-field", verifyToken,userController.updateSingleField);
router.put("/:id", userController.updateSingleField);
router.delete("/:id", userController.deleteUser);
module.exports = router;
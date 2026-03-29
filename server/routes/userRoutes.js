const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/auth");
// Create
router.post("/", userController.createUser);

// Read
router.get("/", userController.getAllUsers);
router.get("/profile", verifyToken, userController.getProfile);
router.get("/:id", userController.getUserById);

// Update
router.put("/:id", userController.updateUser);

// Delete
router.delete("/:id", userController.deleteUser);

module.exports = router;
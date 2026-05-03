const express = require("express");
const { getAllRoles,insertRolesWithMapping } = require("../controllers/roleController");

const router = express.Router();

router.get("/roles", getAllRoles);
// router.get("/troles", getAllRoles);
router.get("/insert-roles", insertRolesWithMapping);

module.exports = router;
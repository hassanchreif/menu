const express = require("express");
const router = express.Router();
const {
  createMember,
  getMembers,
} = require("../controllers/memberController");

const authMiddleware = require("../middleware/authMiddleware");
const { deleteMember } = require("../controllers/memberController");

// 🔒 Protected routes
router.post("/", authMiddleware, createMember);
router.get("/", authMiddleware, getMembers);
router.delete("/:id", deleteMember);


module.exports = router;

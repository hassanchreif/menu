const express = require("express");
const router = express.Router();
const {
  createMember,
  getMembers,
  deleteMember,
  updateMember, // ✅ make sure to include this
} = require("../controllers/memberController");

const authMiddleware = require("../middleware/authMiddleware");

// 🔒 Protected routes
router.post("/", authMiddleware, createMember);
router.get("/", authMiddleware, getMembers);
router.delete("/:id", authMiddleware, deleteMember);
router.put("/:id", authMiddleware, updateMember);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createMember,
  getMembers,
  deleteMember,
  updateMember,
  extendSubscription, // ✅ added missing export
} = require("../controllers/memberController");

const authMiddleware = require("../middleware/authMiddleware");

// 🔒 Protected routes
router.post("/", authMiddleware, createMember);
router.get("/", authMiddleware, getMembers);
router.delete("/:id", authMiddleware, deleteMember);
router.put("/:id", authMiddleware, updateMember);
router.put("/:id/extend", authMiddleware, extendSubscription); // ✅ added missing route

module.exports = router;

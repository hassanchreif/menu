const express = require("express");
const router = express.Router();
const {
  createMember,
  getMembers,
} = require("../controllers/memberController");

const authMiddleware = require("../middleware/authMiddleware");

// 🔒 Protected routes
router.post("/", authMiddleware, createMember);
router.get("/", authMiddleware, getMembers);

module.exports = router;

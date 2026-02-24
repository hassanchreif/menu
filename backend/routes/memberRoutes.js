const express = require("express");
const router = express.Router();
const {
  createMember,
  getMembers,
  deleteMember,
  updateMember,
  extendSubscription, // ✅ added missing export
} = require("../controllers/memberController");

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// 🔒 Protected routes
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createMember
);
router.get("/", authMiddleware, getMembers);
router.delete("/:id", authMiddleware, deleteMember);
router.put("/:id", authMiddleware, upload.single("image"), updateMember);
router.put("/:id/extend", authMiddleware, extendSubscription); // ✅ added missing route

module.exports = router;

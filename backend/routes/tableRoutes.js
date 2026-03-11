const express = require("express");
const router = express.Router();
const {
  initializeTables,
  getAllTables,
  updateTablePin,
  verifyTablePin,
  resetTablePin,
} = require("../controllers/tableController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route - Verify table PIN (for customers)
router.post("/verify-pin", verifyTablePin);

// Public route - Initialize tables (can be called once to setup)
router.post("/initialize", initializeTables);

// Protected routes - Owner only
router.get("/", authMiddleware, getAllTables);
router.put("/:tableNumber/pin", authMiddleware, updateTablePin);
router.post("/:tableNumber/reset-pin", authMiddleware, resetTablePin);

module.exports = router;


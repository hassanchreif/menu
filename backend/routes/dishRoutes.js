const express = require("express");
const router = express.Router();
const {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} = require("../controllers/dishController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes - Customers can view dishes
router.get("/", getAllDishes);
router.get("/:id", getDishById);

// Protected routes - Only owner can create, update, delete
router.post("/", authMiddleware, createDish);
router.put("/:id", authMiddleware, updateDish);
router.delete("/:id", authMiddleware, deleteDish);

module.exports = router;


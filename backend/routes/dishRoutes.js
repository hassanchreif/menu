const express = require("express");
const router = express.Router();
const {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  toggleAvailability,
} = require("../controllers/dishController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes - Customers can view dishes
router.get("/", getAllDishes);
router.get("/:id", getDishById);

// Protected routes - Only owner can create, update, delete
// upload.single('image') handles multipart/form-data file upload
router.post("/", authMiddleware, upload.single("image"), createDish);
router.put("/:id", authMiddleware, upload.single("image"), updateDish);
router.delete("/:id", authMiddleware, deleteDish);

// Toggle dish availability (owner only)
router.patch("/:id/availability", authMiddleware, toggleAvailability);

module.exports = router;


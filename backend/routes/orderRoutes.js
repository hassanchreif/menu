const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getPendingOrders,
  getRecentOrders,
  getOrderById,
  terminateOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route - Customer creates an order
router.post("/", createOrder);

// Protected routes - Owner only
router.get("/", authMiddleware, getAllOrders);
router.get("/pending", authMiddleware, getPendingOrders);
router.get("/history", authMiddleware, getRecentOrders);
router.get("/:id", authMiddleware, getOrderById);
router.patch("/:id/terminate", authMiddleware, terminateOrder);

module.exports = router;


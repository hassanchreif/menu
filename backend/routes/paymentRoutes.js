const express = require("express");
const router = express.Router();
const { addPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔒 Protected route to add payment
router.post("/:id", authMiddleware, addPayment);

module.exports = router;

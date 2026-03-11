const Order = require("../models/Order");
const Table = require("../models/Table");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, tableNumber, totalAmount, pin } = req.body;

    // Validate required fields
    if (!items || !tableNumber || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    if (tableNumber < 1 || tableNumber > 12) {
      return res.status(400).json({ message: "Table number must be between 1 and 12" });
    }

    // Verify table PIN
    const table = await Table.findOne({ tableNumber: parseInt(tableNumber) });
    
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (!table.isActive) {
      return res.status(403).json({ message: "Table is not active" });
    }

    if (table.pin !== pin) {
      return res.status(401).json({ message: "Invalid table PIN" });
    }

    const order = new Order({
      items,
      tableNumber,
      totalAmount,
      status: "pending",
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Get all orders (for owner)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Get pending orders (for owner notifications)
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ message: "Failed to fetch pending orders", error: error.message });
  }
};

// Get orders from last 24 hours (for history)
exports.getRecentOrders = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const orders = await Order.find({
      createdAt: { $gte: twentyFourHoursAgo },
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Failed to fetch recent orders", error: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// Update order status (terminate/complete)
exports.terminateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "terminated";
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error terminating order:", error);
    res.status(500).json({ message: "Failed to terminate order", error: error.message });
  }
};


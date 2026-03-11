const Table = require("../models/Table");

// Initialize all 12 tables with default PIN 0000 if not exist
exports.initializeTables = async (req, res) => {
  try {
    const tables = [];
    for (let i = 1; i <= 12; i++) {
      const existingTable = await Table.findOne({ tableNumber: i });
      if (!existingTable) {
        // Default PIN is 0000
        tables.push({
          tableNumber: i,
          pin: "0000",
          isActive: true,
        });
      }
    }
    
    if (tables.length > 0) {
      await Table.insertMany(tables);
    }
    
    const allTables = await Table.find().sort({ tableNumber: 1 });
    res.json(allTables);
  } catch (error) {
    console.error("Error initializing tables:", error);
    res.status(500).json({ message: "Failed to initialize tables", error: error.message });
  }
};

// Get all tables (owner only)
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    // Return PINs to owner so they can view/edit
    const tablesWithPins = tables.map(t => ({
      _id: t._id,
      tableNumber: t.tableNumber,
      pin: t.pin,
      isActive: t.isActive,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
    res.json(tablesWithPins);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ message: "Failed to fetch tables", error: error.message });
  }
};

// Update table PIN or toggle availability (owner only)
exports.updateTablePin = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const { pin, isActive } = req.body;
    
    if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }
    
    let table = await Table.findOne({ tableNumber: parseInt(tableNumber) });
    
    if (!table) {
      // Create new table if doesn't exist with default PIN 0000
      table = new Table({
        tableNumber: parseInt(tableNumber),
        pin: pin || "0000",
        isActive: isActive !== undefined ? isActive : true,
      });
    } else {
      if (pin) table.pin = pin;
      if (isActive !== undefined) table.isActive = isActive;
    }
    
    const savedTable = await table.save();
    
    res.json({
      _id: savedTable._id,
      tableNumber: savedTable.tableNumber,
      isActive: savedTable.isActive,
      createdAt: savedTable.createdAt,
      updatedAt: savedTable.updatedAt,
    });
  } catch (error) {
    console.error("Error updating table:", error);
    res.status(500).json({ message: "Failed to update table", error: error.message });
  }
};

// Verify table PIN (public - for customers)
exports.verifyTablePin = async (req, res) => {
  try {
    const { tableNumber, pin } = req.body;
    
    if (!tableNumber || !pin) {
      return res.status(400).json({ message: "Table number and PIN are required" });
    }
    
    const table = await Table.findOne({ tableNumber: parseInt(tableNumber) });
    
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    
    if (!table.isActive) {
      return res.status(403).json({ message: "Table is not active" });
    }
    
    if (table.pin !== pin) {
      return res.status(401).json({ message: "Invalid PIN" });
    }
    
    res.json({ valid: true, message: "PIN verified successfully", tableId: table._id, tableNumber: table.tableNumber });
  } catch (error) {
    console.error("Error verifying PIN:", error);
    res.status(500).json({ message: "Failed to verify PIN", error: error.message });
  }
};

// Reset table PIN (owner only)
exports.resetTablePin = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    
    const table = await Table.findOne({ tableNumber: parseInt(tableNumber) });
    
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    
    // Generate new PIN
    table.pin = Math.floor(1000 + Math.random() * 9000).toString();
    await table.save();
    
    res.json({
      _id: table._id,
      tableNumber: table.tableNumber,
      pin: table.pin,
      isActive: table.isActive,
    });
  } catch (error) {
    console.error("Error resetting PIN:", error);
    res.status(500).json({ message: "Failed to reset PIN", error: error.message });
  }
};

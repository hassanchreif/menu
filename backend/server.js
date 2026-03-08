require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const dishRoutes = require("./routes/dishRoutes");

const app = express();

// Ensure uploads directories exist
const ensureUploadsDir = () => {
  const dirs = ["uploads", "uploads/dishes"];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
ensureUploadsDir();

app.use(cors());
app.use(express.json());

// Serve uploaded images - dishes folder serves both /uploads/dishes and /uploads/members paths
// This ensures old images (stored as /uploads/members/...) still work after folder rename
app.use("/uploads/dishes", express.static("uploads/dishes"));
app.use("/uploads/members", express.static("uploads/dishes")); // Point to dishes folder
app.use("/uploads", express.static("uploads/dishes"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);


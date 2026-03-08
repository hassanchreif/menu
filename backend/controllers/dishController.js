const Dish = require("../models/Dish");

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ message: "Error fetching dishes: " + error.message });
  }
};

// Get dish by ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new dish
exports.createDish = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    // Validate required fields
    if (!name || !price || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate price is a positive number
    const priceNum = typeof price === "number" ? price : parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    // Validate category is valid
    const validCategories = ["Pizza", "Burger", "Pasta", "Drinks", "Dessert"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Validate name is a non-empty string
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "Name must be a non-empty string" });
    }

    // Validate description is a non-empty string
    if (typeof description !== "string" || description.trim().length === 0) {
      return res.status(400).json({ message: "Description must be a non-empty string" });
    }

    // Handle image: use uploaded file path or URL from body
    let image;
    if (req.file) {
      // File was uploaded via Multer
      image = `/uploads/dishes/${req.file.filename}`;
    } else if (req.body.image) {
      // Fallback to URL from body
      image = req.body.image.trim();
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    const dish = new Dish({
      name: name.trim(),
      price: priceNum,
      category,
      description: description.trim(),
      image,
    });
    const savedDish = await dish.save();
    res.status(201).json(savedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update dish
exports.updateDish = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    // Validate required fields
    if (!name || !price || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate price is a positive number
    const priceNum = typeof price === "number" ? price : parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    // Validate category is valid
    const validCategories = ["Pizza", "Burger", "Pasta", "Drinks", "Dessert"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Validate name is a non-empty string
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "Name must be a non-empty string" });
    }

    // Validate description is a non-empty string
    if (typeof description !== "string" || description.trim().length === 0) {
      return res.status(400).json({ message: "Description must be a non-empty string" });
    }

    // Handle image: use uploaded file path or URL from body
    let image;
    if (req.file) {
      // File was uploaded via Multer
      image = `/uploads/dishes/${req.file.filename}`;
    } else if (req.body.image) {
      // Fallback to URL from body
      image = req.body.image.trim();
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), price: priceNum, category, description: description.trim(), image },
      { new: true, runValidators: true }
    );
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json(dish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete dish
exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    console.log("Deleting dish image:", dish.image);

    // Delete the image file from disk if it exists and is a local file
    if (dish.image && !dish.image.startsWith("http")) {
      // Extract filename from path (e.g., /uploads/dishes/filename.jpg or /uploads/members/filename.jpg)
      const filename = dish.image.split("/").pop();
      if (filename) {
        const fs = require("fs");
        const path = require("path");
        
        // Try both dishes and members folders
        const dishesPath = path.join(__dirname, "../../uploads/dishes", filename);
        const membersPath = path.join(__dirname, "../../uploads/members", filename);
        
        console.log("Trying dishes path:", dishesPath, "exists:", fs.existsSync(dishesPath));
        console.log("Trying members path:", membersPath, "exists:", fs.existsSync(membersPath));
        
        if (fs.existsSync(dishesPath)) {
          fs.unlinkSync(dishesPath);
          console.log("Deleted from dishes folder");
        } else if (fs.existsSync(membersPath)) {
          fs.unlinkSync(membersPath);
          console.log("Deleted from members folder");
        } else {
          console.log("File not found in either folder");
        }
      }
    }

    // Delete the dish from MongoDB
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({ message: error.message });
  }
};


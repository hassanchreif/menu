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
    const { name, price, category, description, image } = req.body;

    // Validate required fields
    if (!name || !price || !category || !description || !image) {
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

    // Validate image is a non-empty string (URL)
    if (typeof image !== "string" || image.trim().length === 0) {
      return res.status(400).json({ message: "Image must be a valid URL" });
    }

    const dish = new Dish({
      name: name.trim(),
      price: priceNum,
      category,
      description: description.trim(),
      image: image.trim(),
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
    const { name, price, category, description, image } = req.body;

    // Validate required fields
    if (!name || !price || !category || !description || !image) {
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

    // Validate image is a non-empty string (URL)
    if (typeof image !== "string" || image.trim().length === 0) {
      return res.status(400).json({ message: "Image must be a valid URL" });
    }

    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), price: priceNum, category, description: description.trim(), image: image.trim() },
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
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


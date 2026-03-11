const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  dishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dish",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Order must have at least one item",
      },
    },
    tableNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "terminated"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Index for querying orders within 24 hours
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);


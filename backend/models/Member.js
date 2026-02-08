const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    height: Number,
    weight: Number,
    subscriptionType: {
      type: String,
      enum: ["daily", "monthly", "6months", "yearly"],
      required: true,
    },
    subscriptionStart: { type: Date, default: Date.now },
    subscriptionEnd: Date,
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Custom validator using 'validate' property (no hooks, no next)
memberSchema.path("email").validate(function (value) {
  if (!value && !this.phone) {
    throw new Error("A member must have either an email or a phone number");
  }
  return true;
});

memberSchema.path("phone").validate(function (value) {
  if (!value && !this.email) {
    throw new Error("A member must have either an email or a phone number");
  }
  return true;
});

module.exports = mongoose.model("Member", memberSchema);

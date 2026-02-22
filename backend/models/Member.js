const mongoose = require("mongoose");

// Main member schema
const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    subscriptionType: {
      type: String,
      enum: ["daily", "monthly", "6months", "yearly"],
      required: true,
    },
    subscriptionStart: { type: Date, default: Date.now },
    subscriptionEnd: Date,
    image: {
  type: String,
  default: "",
},
  },
  { timestamps: true }
);

// Validate that at least email or phone exists
memberSchema.path("email").validate(function (value) {
  if (!value && !this.phone) throw new Error("A member must have either an email or a phone number");
  return true;
});
memberSchema.path("phone").validate(function (value) {
  if (!value && !this.email) throw new Error("A member must have either an email or a phone number");
  return true;
});

// Method to set subscription duration
memberSchema.methods.setSubscription = function(type) {
  const start = new Date();
  const end = new Date(start);

  switch(type) {
    case "daily": end.setDate(start.getDate() + 1); break;
    case "monthly": end.setMonth(start.getMonth() + 1); break;
    case "6months": end.setMonth(start.getMonth() + 6); break;
    case "yearly": end.setFullYear(start.getFullYear() + 1); break;
  }

  this.subscriptionType = type;
  this.subscriptionStart = start;
  this.subscriptionEnd = end;

  return this.save();
};

module.exports = mongoose.model("Member", memberSchema);

const mongoose = require("mongoose");

// Payment schema for tracking payments
const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, enum: ["cash", "card", "online"], default: "cash" },
  subscriptionType: { 
    type: String, 
    enum: ["daily", "monthly", "6months", "yearly"],
    required: true
  }
});

// Main member schema
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
    payments: [paymentSchema], // array of payment objects
  },
  { timestamps: true }
);

// Validate that at least email or phone exists
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

// Optional: update subscriptionEnd automatically when a payment is added
memberSchema.methods.addPayment = function(payment) {
  this.payments.push(payment);
  const start = new Date();
  let end = new Date(start);

  switch(payment.subscriptionType) {
    case "daily":
      end.setDate(start.getDate() + 1);
      break;
    case "monthly":
      end.setMonth(start.getMonth() + 1);
      break;
    case "6months":
      end.setMonth(start.getMonth() + 6);
      break;
    case "yearly":
      end.setFullYear(start.getFullYear() + 1);
      break;
  }

  this.subscriptionStart = start;
  this.subscriptionEnd = end;
  this.balance += payment.amount;
  return this.save();
};

module.exports = mongoose.model("Member", memberSchema);

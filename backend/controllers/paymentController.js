const Member = require("../models/member");

// Add a payment to a member
exports.addPayment = async (req, res) => {
  try {
    const { amount, method, subscriptionType } = req.body;
    const memberId = req.params.id;

    // Find the member
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Add payment and update subscriptionEnd automatically
    await member.addPayment({ amount, method, subscriptionType });

    res.status(200).json({ message: "Payment added and subscription updated", member });
  } catch (error) {
    res.status(500).json({ message: "Failed to add payment", error: error.message });
  }
};

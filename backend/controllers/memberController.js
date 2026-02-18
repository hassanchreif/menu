const Member = require("../models/member");

// Create a new member
exports.createMember = async (req, res) => {
  try {
    const { name, email, phone, gender, subscriptionType } = req.body;

    const member = await Member.create({ name, email, phone, gender, subscriptionType });
    await member.setSubscription(subscriptionType); // automatically set end date

    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: "Failed to create member", error: error.message });
  }
};

// Get all members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete member" });
  }
};

// Update member info
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to update member", error: error.message });
  }
};

// Extend subscription
exports.extendSubscription = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const { subscriptionType } = req.body;
    await member.setSubscription(subscriptionType);

    res.json({ message: "Subscription extended", member });
  } catch (error) {
    res.status(500).json({ message: "Failed to extend subscription", error: error.message });
  }
};

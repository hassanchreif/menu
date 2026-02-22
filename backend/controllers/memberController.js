const Member = require("../models/member");

// =======================
// CREATE MEMBER
// =======================
exports.createMember = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      gender,
      subscriptionType,
    } = req.body;

    const now = new Date();
    let end = new Date();

    switch (subscriptionType) {
      case "daily":
        end.setDate(now.getDate() + 1);
        break;
      case "monthly":
        end.setMonth(now.getMonth() + 1);
        break;
      case "6months":
        end.setMonth(now.getMonth() + 6);
        break;
      case "yearly":
        end.setFullYear(now.getFullYear() + 1);
        break;
    }

    const newMember = new Member({
      name,
      phone,
      email,
      gender,
      subscriptionType,
      subscriptionStart: now,
      subscriptionEnd: end,
      image: req.file ? req.file.path.replace(/\\/g, "/") : "",
    });

    await newMember.save();

    res.json(newMember);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create member failed" });
  }
};


// =======================
// GET MEMBERS
// =======================
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
};


// =======================
// DELETE MEMBER
// =======================
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member)
      return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Member deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete member" });
  }
};


// =======================
// UPDATE MEMBER
// =======================
exports.updateMember = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      updatedData.image = req.file.path.replace(/\\/g, "/");
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!member)
      return res.status(404).json({ message: "Member not found" });

    res.json(member);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update member",
      error: error.message,
    });
  }
};


// =======================
// EXTEND SUBSCRIPTION
// =======================
exports.extendSubscription = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member)
      return res.status(404).json({ message: "Member not found" });

    const { subscriptionType } = req.body;

    const now = new Date();
    let end = new Date();

    switch (subscriptionType) {
      case "daily":
        end.setDate(now.getDate() + 1);
        break;
      case "monthly":
        end.setMonth(now.getMonth() + 1);
        break;
      case "6months":
        end.setMonth(now.getMonth() + 6);
        break;
      case "yearly":
        end.setFullYear(now.getFullYear() + 1);
        break;
    }

    member.subscriptionType = subscriptionType;
    member.subscriptionStart = now;
    member.subscriptionEnd = end;

    await member.save();

    res.json({ message: "Subscription extended", member });

  } catch (error) {
    res.status(500).json({
      message: "Failed to extend subscription",
      error: error.message,
    });
  }
};
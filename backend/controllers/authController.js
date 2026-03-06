const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check against environment variables
  if (email === process.env.OWNER_EMAIL && password === process.env.OWNER_PASSWORD) {
    const token = jwt.sign(
      { id: "owner_id", role: "owner" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({ token, role: "owner" });
  }

  res.status(401).json({ message: "Invalid credentials" });
};


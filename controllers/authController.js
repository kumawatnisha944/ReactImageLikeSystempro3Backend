const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// 🔐 SIGNUP
// =======================
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 🔒 password hash
    const hashed = await bcrypt.hash(password, 10);

    // 👤 create user
    const user = await User.create({
      username,
      email,
      password: hashed,
      role: role || "user" // 🔥 IMPORTANT (admin/user)
    });

    res.json({
      message: "Signup successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =======================
// 🔐 LOGIN
// =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 👤 find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // 🔑 check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // 🎟️ token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey"
    );

    // 🔥 IMPORTANT: send role also
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
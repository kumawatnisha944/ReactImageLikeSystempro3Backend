const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token" });
    }

    // 🔥 FIX: Bearer hatao
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded;

    next();
  } catch (err) {
    console.log("❌ TOKEN ERROR:", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};
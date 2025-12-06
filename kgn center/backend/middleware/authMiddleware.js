const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  let token;

  // 1️⃣ Try Authorization Header (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ If not found, try HTTP-only Cookie token
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 3️⃣ If still missing → User is not logged in
  if (!token) {
    return res.status(401).json({ msg: "No authentication token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found (maybe deleted)" });
    }

    req.user = user; // Attach logged-in user to request
    next(); // Continue

  } catch (err) {
    console.error("TOKEN ERROR:", err);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

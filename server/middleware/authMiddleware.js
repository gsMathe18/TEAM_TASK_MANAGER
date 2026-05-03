const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select("_id role");

    if (!currentUser) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        msg: "Access denied: insufficient permissions"
      });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
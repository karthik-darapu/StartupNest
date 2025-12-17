
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_KEY || 'sdfsfdsafsddfasdfasdfasdf';

const generateToken = (userId, userName, role) => {
  return jwt.sign({ userId, userName, role }, secret, { expiresIn: "1h" });
};

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      return res.status(401).json({ message: "Access denied. No token provided." });

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, secret);

    req.user = {
      userId: decoded.userId,
      userName: decoded.userName,
      role: decoded.role,
    };

    next();
  } catch (error) {
    const msg = error && error.message ? error.message : String(error);
    console.error("Token validation error:", msg);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission to perform this action.",
        requiredRole: allowedRoles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

module.exports = { generateToken, validateToken, authorizeRole };
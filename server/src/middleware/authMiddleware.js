const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

// Auth middleware: verify JWT token
const authMiddleWare = async (req, res, next) => {
  try {
    // Hỗ trợ cả authorization và token header
    let token = req.headers.authorization?.split(" ")[1];
    if (!token && req.headers.token) {
      token = req.headers.token.split(" ")[1] || req.headers.token;
    }
    
    if (!token) {
      return res.status(401).json({
        status: "ERR",
        message: "Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-access-token-secret-key-here-change-in-production");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "ERR",
        message: "User not found",
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "ERR",
      message: "Invalid token",
    });
  }
};

// Auth middleware for user-specific access
const authUserMiddleWare = async (req, res, next) => {
  try {
    // Hỗ trợ cả authorization và token header
    let token = req.headers.authorization?.split(" ")[1];
    if (!token && req.headers.token) {
      token = req.headers.token.split(" ")[1] || req.headers.token;
    }
    
    if (!token) {
      return res.status(401).json({
        status: "ERR",
        message: "Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-access-token-secret-key-here-change-in-production");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "ERR",
        message: "User not found",
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "ERR",
      message: "Invalid token",
    });
  }
};

module.exports = {
  authMiddleWare,
  authUserMiddleWare,
};

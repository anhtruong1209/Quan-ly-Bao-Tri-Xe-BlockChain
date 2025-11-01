const jwt = require("jsonwebtoken");

// Auth disabled: allow all requests to pass through
const authMiddleWare = (req, res, next) => {
  return next();
};

// Auth disabled: allow all requests and user-specific access
const authUserMiddleWare = (req, res, next) => {
  return next();
};

module.exports = {
  authMiddleWare,
  authUserMiddleWare,
};

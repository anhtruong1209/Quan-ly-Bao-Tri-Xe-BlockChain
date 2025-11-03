const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");

// Auth routes
router.post("/sign-in", userController.loginUser);
router.post("/sign-up", userController.createUser);
router.post("/log-out", userController.logoutUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/forgot-password", userController.forgotPassword);
router.post("/change-password/:id", authUserMiddleWare, userController.changePassword);

// Protected routes
router.put("/update-user/:id", authMiddleWare, userController.updateUser);
router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
router.get("/getAll", authMiddleWare, userController.getAllUser);
router.get(
  "/get-details/:id",
  authUserMiddleWare,
  userController.getDetailsUser
);
router.post("/delete-many", authMiddleWare, userController.deleteMany);

module.exports = router;

const express = require("express");
const router = express.Router();
const MaintenanceController = require("../controllers/MaintenanceController");
const { authMiddleWare } = require("../middleware/authMiddleware");

// User routes
router.post(
  "/create",
  authMiddleWare,
  MaintenanceController.createMaintenanceRegistration
);
router.get(
  "/user",
  authMiddleWare,
  MaintenanceController.getUserMaintenanceRegistrations
);
router.get(
  "/:id",
  authMiddleWare,
  MaintenanceController.getMaintenanceRegistrationDetails
);

// Admin routes
router.get(
  "/admin/pending",
  authMiddleWare,
  MaintenanceController.getPendingMaintenanceRegistrations
);
router.put(
  "/admin/approve/:id",
  authMiddleWare,
  MaintenanceController.approveMaintenanceRegistration
);
router.put(
  "/admin/reject/:id",
  authMiddleWare,
  MaintenanceController.rejectMaintenanceRegistration
);

module.exports = router;


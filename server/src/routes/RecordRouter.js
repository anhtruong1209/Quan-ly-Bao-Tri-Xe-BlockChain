const express = require("express");
const router = express.Router();
const RecordController = require("../controllers/RecordController");
const { authMiddleWare } = require("../middleware/authMiddleware");

// Service records
router.post("/service", /* authMiddleWare, */ RecordController.createServiceRecord);
router.get("/service", RecordController.listServiceRecords);

// Warranty claims
router.post("/warranty", /* authMiddleWare, */ RecordController.createWarrantyClaim);
router.put("/warranty/:id/resolve", /* authMiddleWare, */ RecordController.resolveWarrantyClaim);
router.get("/warranty", RecordController.listWarrantyClaims);

module.exports = router;



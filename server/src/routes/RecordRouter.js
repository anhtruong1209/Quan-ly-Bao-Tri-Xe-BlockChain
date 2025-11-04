const express = require("express");
const router = express.Router();
const RecordController = require("../controllers/RecordController");
const { authMiddleWare } = require("../middleware/authMiddleware");

// Service records
router.post("/service", authMiddleWare, RecordController.createServiceRecord);
router.get("/service", authMiddleWare, RecordController.listServiceRecords);
router.delete("/service/:id", authMiddleWare, RecordController.deleteServiceRecord);
router.post("/service/:id/accept", authMiddleWare, RecordController.acceptServiceRecord);
router.get("/service/pending", authMiddleWare, RecordController.getPendingServiceRecords); // Admin: Lấy danh sách chờ duyệt
router.put("/service/:id/approve", authMiddleWare, RecordController.approveServiceRecord); // Admin: Duyệt
router.put("/service/:id/reject", authMiddleWare, RecordController.rejectServiceRecord); // Admin: Từ chối
router.put("/service/:id/payment", authMiddleWare, RecordController.updatePayment); // User: Cập nhật payment hash sau khi thanh toán

// Warranty claims
router.post("/warranty", /* authMiddleWare, */ RecordController.createWarrantyClaim);
router.put("/warranty/:id/resolve", /* authMiddleWare, */ RecordController.resolveWarrantyClaim);
router.get("/warranty", RecordController.listWarrantyClaims);

module.exports = router;



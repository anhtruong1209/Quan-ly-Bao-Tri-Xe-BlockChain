const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/TransactionController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", authMiddleWare, TransactionController.createTransaction);
router.get("/list", authMiddleWare, TransactionController.listTransactions);
router.get("/details/:id", authMiddleWare, TransactionController.getTransactionDetails);
router.get("/user/transactions", authMiddleWare, TransactionController.getUserTransactions);
router.get("/pending", authMiddleWare, TransactionController.getPendingTransactions);
router.put("/approve/:id", authMiddleWare, TransactionController.approveTransaction);
router.put("/reject/:id", authMiddleWare, TransactionController.rejectTransaction);
router.post("/anchor/:id", authMiddleWare, TransactionController.anchorTransaction);

module.exports = router;


const TransactionService = require("../services/TransactionService");
const RealEstateBlockchain = require("../services/RealEstateBlockchainService");

const createTransaction = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      realEstateId,
      propertyCode,
      transactionType,
      content,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerIdCard,
      buyerAddress,
      sellerName,
      sellerEmail,
      sellerPhone,
      sellerIdCard,
      sellerAddress,
      transactionPrice,
      deposit,
      contractDate,
      transferDate,
      notes,
    } = req.body;

    if (!realEstateId || !propertyCode || !transactionType || !content || !transactionPrice) {
      return res.status(400).json({
        status: "ERR",
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const transactionData = {
      realEstate: realEstateId,
      propertyCode,
      user: userId,
      transactionType,
      content,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerIdCard,
      buyerAddress,
      sellerName,
      sellerEmail,
      sellerPhone,
      sellerIdCard,
      sellerAddress,
      transactionPrice,
      deposit: deposit || 0,
      contractDate,
      transferDate,
      notes,
      status: "pending",
    };

    const response = await TransactionService.createTransaction(transactionData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const listTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.isAdmin;
    const { search, limit, page, filter, status } = req.query;

    let query = {};
    if (!isAdmin && userId) {
      // User chỉ xem được giao dịch của mình
      query.user = userId;
    }
    if (status) {
      query.status = status;
    }

    const response = await TransactionService.getAllTransactions(
      search,
      parseInt(limit) || 20,
      parseInt(page) || 1,
      filter ? filter.split(",") : null
    );

    // Filter theo user nếu không phải admin
    if (!isAdmin && userId) {
      response.data = response.data.filter(t => t.user?._id?.toString() === userId.toString());
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const getTransactionDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await TransactionService.getTransactionDetails(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID is required",
      });
    }
    const response = await TransactionService.getUserTransactions(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const getPendingTransactions = async (req, res) => {
  try {
    const response = await TransactionService.getPendingTransactions();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const approveTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const approverId = req.user?.id;
    const response = await TransactionService.approveTransaction(id, approverId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const rejectTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const approverId = req.user?.id;
    const response = await TransactionService.rejectTransaction(id, approverId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const anchorTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const Transaction = require("../model/TransactionModel");
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ status: "ERR", message: "Transaction not found" });
    }
    
    if (transaction.anchored) {
      return res.status(400).json({ status: "ERR", message: "Transaction already anchored" });
    }

    if (transaction.status !== "approved") {
      return res.status(400).json({ status: "ERR", message: "Transaction must be approved before anchoring" });
    }

    // Anchor lên blockchain
    try {
      const propertyCode = transaction.propertyCode;
      const bc = await RealEstateBlockchain.anchorTransaction(propertyCode, transaction.contentHash);
      transaction.anchored = true;
      transaction.status = "anchored";
      transaction.txHash = bc.txHash;
      transaction.blockNumber = bc.blockNumber;
      await transaction.save();
      return res.status(200).json({ status: "OK", data: transaction });
    } catch (blockchainError) {
      console.error("Blockchain error:", blockchainError);
      
      if (blockchainError.reason === "not garage" || blockchainError.message?.includes("not garage")) {
        return res.status(500).json({ 
          status: "ERR", 
          message: `Blockchain error: Wallet không có quyền. Vui lòng chạy script setGarageRole hoặc deploy lại contract mới. Chi tiết: ${blockchainError.message}` 
        });
      }
      
      return res.status(500).json({ status: "ERR", message: `Blockchain error: ${blockchainError.message}` });
    }
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

module.exports = {
  createTransaction,
  listTransactions,
  getTransactionDetails,
  getUserTransactions,
  getPendingTransactions,
  approveTransaction,
  rejectTransaction,
  anchorTransaction,
};


const Transaction = require("../model/TransactionModel");
const RealEstate = require("../model/RealEstateModel");
const RealEstateBlockchain = require("./RealEstateBlockchainService");
const crypto = require("crypto");

const createTransaction = async (transactionData) => {
  try {
    // Tạo content hash
    const contentHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(transactionData.content))
      .digest("hex");

    const transaction = await Transaction.create({
      ...transactionData,
      contentHash: contentHash,
    });

    return {
      status: "OK",
      message: "Tạo giao dịch thành công",
      data: transaction,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const getAllTransactions = async (search, limit, page, filter) => {
  try {
    let query = {};
    
    if (search) {
      query.$or = [
        { propertyCode: { $regex: search, $options: "i" } },
        { buyerName: { $regex: search, $options: "i" } },
        { sellerName: { $regex: search, $options: "i" } },
      ];
    }

    if (filter && filter.length >= 2) {
      const field = filter[0];
      const value = filter[1];
      query[field] = { $regex: new RegExp(value, "i") };
    }

    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .populate("realEstate")
      .populate("user")
      .populate("approver")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await Transaction.countDocuments(query);

    return {
      status: "OK",
      message: "SUCCESS",
      data: transactions,
      total: total,
      page: page,
      limit: limit,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const getTransactionDetails = async (id) => {
  try {
    const transaction = await Transaction.findById(id)
      .populate("realEstate")
      .populate("user")
      .populate("approver");
    
    if (!transaction) {
      return {
        status: "ERR",
        message: "Không tìm thấy giao dịch",
      };
    }

    return {
      status: "OK",
      message: "SUCCESS",
      data: transaction,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const getUserTransactions = async (userId) => {
  try {
    const transactions = await Transaction.find({ user: userId })
      .populate("realEstate")
      .sort({ createdAt: -1 });
    
    return {
      status: "OK",
      message: "SUCCESS",
      data: transactions,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const getPendingTransactions = async () => {
  try {
    const transactions = await Transaction.find({ status: "pending" })
      .populate("realEstate")
      .populate("user")
      .sort({ createdAt: -1 });
    
    return {
      status: "OK",
      message: "SUCCESS",
      data: transactions,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const approveTransaction = async (id, approverId) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        status: "approved",
        approved: true,
        processed: true,
        approver: approverId,
      },
      { new: true }
    );

    if (!transaction) {
      return {
        status: "ERR",
        message: "Không tìm thấy giao dịch",
      };
    }

    return {
      status: "OK",
      message: "Duyệt giao dịch thành công",
      data: transaction,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const rejectTransaction = async (id, approverId) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        approved: false,
        processed: true,
        approver: approverId,
      },
      { new: true }
    );

    if (!transaction) {
      return {
        status: "ERR",
        message: "Không tìm thấy giao dịch",
      };
    }

    return {
      status: "OK",
      message: "Từ chối giao dịch thành công",
      data: transaction,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const updateTransaction = async (id, data) => {
  try {
    // Nếu có thay đổi content, tạo lại hash
    if (data.content) {
      data.contentHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(data.content))
        .digest("hex");
    }

    const transaction = await Transaction.findByIdAndUpdate(id, data, { new: true });

    if (!transaction) {
      return {
        status: "ERR",
        message: "Không tìm thấy giao dịch",
      };
    }

    return {
      status: "OK",
      message: "Cập nhật thành công",
      data: transaction,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionDetails,
  getUserTransactions,
  getPendingTransactions,
  approveTransaction,
  rejectTransaction,
  updateTransaction,
};


const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    realEstate: { type: mongoose.Schema.Types.ObjectId, ref: "RealEstate", required: true },
    propertyCode: { type: String, required: true }, // Mã tài sản (để tìm nhanh)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User tạo giao dịch
    // Loại giao dịch
    transactionType: {
      type: String,
      enum: ["sale", "rent", "transfer", "lease"],
      required: true
    },
    // Nội dung giao dịch
    content: { type: Object, required: true }, // Lưu chi tiết giao dịch
    contentHash: { type: String, required: true }, // Hash để lưu lên blockchain
    // Bên mua/Bên thuê
    buyerName: { type: String },
    buyerEmail: { type: String },
    buyerPhone: { type: String },
    buyerIdCard: { type: String },
    buyerAddress: { type: String },
    // Bên bán/Bên cho thuê (có thể là chủ sở hữu)
    sellerName: { type: String },
    sellerEmail: { type: String },
    sellerPhone: { type: String },
    sellerIdCard: { type: String },
    sellerAddress: { type: String },
    // Thông tin giao dịch
    transactionPrice: { type: Number, required: true }, // Giá giao dịch
    deposit: { type: Number, default: 0 }, // Tiền đặt cọc
    contractDate: { type: Date }, // Ngày ký hợp đồng
    transferDate: { type: Date }, // Ngày bàn giao
    // Trạng thái
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "anchored", "cancelled"],
      default: "pending"
    },
    approved: { type: Boolean, default: false },
    processed: { type: Boolean, default: false },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin/Notary duyệt
    // Blockchain
    anchored: { type: Boolean, default: false },
    txHash: { type: String },
    blockNumber: { type: Number },
    // Ghi chú
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);


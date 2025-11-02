const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    vehicleKey: { type: String, required: true }, // e.g., plates or VIN
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User tạo lệnh
    content: { type: Object, required: true },
    contentHash: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected", "anchored"], 
      default: "pending" 
    }, // Trạng thái: pending (chờ duyệt), approved (đã duyệt), rejected (từ chối), anchored (đã lên blockchain)
    approved: { type: Boolean, default: false },
    processed: { type: Boolean, default: false },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin duyệt
    anchored: { type: Boolean, default: false }, // Đã lên blockchain chưa
    txHash: { type: String },
    blockNumber: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRecord", serviceRecordSchema);



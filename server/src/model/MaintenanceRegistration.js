const mongoose = require("mongoose");

const maintenanceRegistrationSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    vehicleId: { type: String, required: true }, // hash của plate hoặc VIN
    vehicleKey: { type: String, required: true }, // plate hoặc VIN gốc
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: Object, required: true }, // thông tin bảo trì
    contentHash: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    approved: { type: Boolean, default: false },
    processed: { type: Boolean, default: false },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    txHash: { type: String }, // transaction hash trên blockchain
    blockNumber: { type: Number },
    regId: { type: Number }, // ID từ smart contract
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceRegistration", maintenanceRegistrationSchema);


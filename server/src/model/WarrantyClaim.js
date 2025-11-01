const mongoose = require("mongoose");

const warrantyClaimSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    vehicleKey: { type: String, required: true },
    content: { type: Object, required: true },
    contentHash: { type: String, required: true },
    status: { type: String, enum: ["created", "resolved"], default: "created" },
    approved: { type: Boolean },
    resolution: { type: Object },
    resolutionHash: { type: String },
    txHash: { type: String },
    blockNumber: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WarrantyClaim", warrantyClaimSchema);



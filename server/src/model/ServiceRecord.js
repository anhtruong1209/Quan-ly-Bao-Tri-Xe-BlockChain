const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    vehicleKey: { type: String, required: true }, // e.g., plates or VIN
    content: { type: Object, required: true },
    contentHash: { type: String, required: true },
    anchored: { type: Boolean, default: false },
    txHash: { type: String },
    blockNumber: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRecord", serviceRecordSchema);



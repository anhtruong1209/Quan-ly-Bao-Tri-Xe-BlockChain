
const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    image: { type: [String], require: true },
    identifynumber: { type: String, required: true, unique: true },
    dated: { type: Date, require: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    plates: { type: String, require: true, unique: true },
    bill: { type: String, require: true },
    tax: { type: String, require: true },
    seri: { type: String, require: true },
    license: { type: String, require: true },
    engine: { type: String, require: true },
    frame: { type: String, require: true },
    fuel: {type: String, require: true},//
    type: { type: String, require: true },
    color: { type: String, require: true },//
    brand: { type: String, require: true },
    rolling: { type: String, require: true },//
    gear: { type: String, require: true },//
    description: { type: String },
  },
  {
    timestamps: true,
  }
);
const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;

const mongoose = require("mongoose");

const realEstateSchema = new mongoose.Schema(
  {
    propertyCode: { type: String, required: true, unique: true }, // Mã tài sản
    address: { type: String, required: true }, // Địa chỉ
    ward: { type: String }, // Phường/Xã
    district: { type: String }, // Quận/Huyện
    city: { type: String, required: true }, // Tỉnh/Thành phố
    area: { type: Number, required: true }, // Diện tích (m2)
    price: { type: Number, required: true }, // Giá (VNĐ)
    pricePerM2: { type: Number }, // Giá/m2
    type: { 
      type: String, 
      required: true,
      enum: ["apartment", "house", "land", "villa", "office", "warehouse", "other"]
    }, // Loại BĐS
    status: {
      type: String,
      enum: ["available", "sold", "rented", "pending"],
      default: "available"
    },
    images: { type: [String], default: [] },
    description: { type: String },
    // Thông tin chủ sở hữu
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    ownerAddress: { type: String },
    ownerIdCard: { type: String, required: true }, // CMND/CCCD
    // Giấy tờ
    redBook: { type: String }, // Sổ đỏ/Sổ hồng
    buildingPermit: { type: String }, // Giấy phép xây dựng
    landUseRight: { type: String }, // Giấy chứng nhận quyền sử dụng đất
    // Thông tin pháp lý
    legalStatus: {
      type: String,
      enum: ["clean", "pending", "dispute"],
      default: "clean"
    },
    // Hướng nhà/đất
    direction: {
      type: String,
      enum: ["north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest", "other"]
    },
    // Tầng/lô (nếu là chung cư)
    floor: { type: Number },
    roomNumber: { type: String },
    // Tiện ích
    utilities: { type: [String], default: [] }, // parking, elevator, security, etc.
    // User reference
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true }, // Email người đăng ký
  },
  {
    timestamps: true,
  }
);

const RealEstate = mongoose.model("RealEstate", realEstateSchema);
module.exports = RealEstate;


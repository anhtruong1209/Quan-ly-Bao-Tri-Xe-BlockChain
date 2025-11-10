const mongoose = require("mongoose");
const ServiceRecord = require("../model/ServiceRecord");
const MaintenanceRegistration = require("../model/MaintenanceRegistration");
const WarrantyClaim = require("../model/WarrantyClaim");

// Hardcode MongoDB connection
const MONGO_DB = "mongodb+srv://admin:admin@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

async function connect() {
  await mongoose.connect(MONGO_DB);
  console.log("✅ Connected to MongoDB");
}

async function cleanUnanchoredData() {
  try {
    console.log("\n🧹 Bắt đầu xóa dữ liệu chưa xác thực...\n");

    // Xóa ServiceRecords chưa xác thực
    const serviceRecordsResult = await ServiceRecord.deleteMany({ anchored: false });
    console.log(`✅ Đã xóa ${serviceRecordsResult.deletedCount} ServiceRecord chưa xác thực`);

    // Xóa MaintenanceRegistrations chưa được xử lý (pending)
    const maintenanceResult = await MaintenanceRegistration.deleteMany({ 
      status: "pending",
      approved: { $ne: true }
    });
    console.log(`✅ Đã xóa ${maintenanceResult.deletedCount} MaintenanceRegistration chưa xác thực`);

    // Xóa WarrantyClaims chưa được resolve
    const warrantyResult = await WarrantyClaim.deleteMany({ 
      status: "created",
      anchored: { $ne: true }
    });
    console.log(`✅ Đã xóa ${warrantyResult.deletedCount} WarrantyClaim chưa xác thực`);

    console.log("\n✅ Hoàn thành xóa dữ liệu chưa xác thực!");
    console.log(`   - ServiceRecords: ${serviceRecordsResult.deletedCount}`);
    console.log(`   - MaintenanceRegistrations: ${maintenanceResult.deletedCount}`);
    console.log(`   - WarrantyClaims: ${warrantyResult.deletedCount}`);
    console.log(`   - Tổng cộng: ${serviceRecordsResult.deletedCount + maintenanceResult.deletedCount + warrantyResult.deletedCount} bản ghi đã bị xóa`);
  } catch (error) {
    console.error("❌ Lỗi khi xóa dữ liệu:", error.message);
    throw error;
  }
}

// Chạy script
connect()
  .then(() => {
    return cleanUnanchoredData();
  })
  .then(() => {
    console.log("\n✅ Script hoàn thành");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Error:", err);
    process.exit(1);
  });


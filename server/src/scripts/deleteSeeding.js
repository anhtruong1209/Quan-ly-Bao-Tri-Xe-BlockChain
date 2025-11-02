const mongoose = require("mongoose");
const ServiceRecord = require("../model/ServiceRecord");

// Hardcode MongoDB connection
const MONGO_DB = "mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

async function connect() {
  await mongoose.connect(MONGO_DB);
}

async function deleteSeeding() {
  try {
    const result = await ServiceRecord.deleteMany({});
    console.log(`✅ Đã xóa ${result.deletedCount} bản ghi bảo trì seeding`);
    return result;
  } catch (error) {
    console.error("❌ Lỗi khi xóa:", error);
    throw error;
  }
}

connect()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return deleteSeeding();
  })
  .then(() => {
    console.log("✅ Xóa seeding data completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });


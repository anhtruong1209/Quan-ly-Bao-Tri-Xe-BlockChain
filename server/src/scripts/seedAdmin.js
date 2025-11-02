const mongoose = require("mongoose");
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");

// Hardcode MongoDB connection
const MONGO_DB = "mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

async function connect() {
  await mongoose.connect(MONGO_DB);
  console.log("✅ Connected to MongoDB");
}

async function seedAdmin() {
  try {
    // Thông tin admin mặc định
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin@123";
    const adminName = "Administrator";

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("ℹ️  Admin account already exists!");
      
      // Cập nhật password về admin@123
      const hash = bcrypt.hashSync(adminPassword, 10);
      existingAdmin.password = hash;
      existingAdmin.isAdmin = true; // Đảm bảo là admin
      await existingAdmin.save();
      console.log("✅ Updated admin password and role");
      
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   isAdmin: ${existingAdmin.isAdmin}`);
      return;
    }

    // Hash password
    const hash = bcrypt.hashSync(adminPassword, 10);

    // Tạo admin account
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hash,
      isAdmin: true,
      phone: "0123456789",
      address: "Hà Nội, Việt Nam",
    });

    console.log("✅ Admin account created successfully!");
    console.log("\n📝 Admin Credentials:");
    console.log("   Email: " + adminEmail);
    console.log("   Password: " + adminPassword);
    console.log("   isAdmin: true");
    console.log("\n⚠️  Please keep these credentials safe!");
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    throw error;
  }
}

// Chạy script
connect()
  .then(() => {
    return seedAdmin();
  })
  .then(() => {
    console.log("\n✅ Seed admin completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Error:", err);
    process.exit(1);
  });


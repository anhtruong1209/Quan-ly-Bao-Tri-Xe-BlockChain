const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/UserModel");
const { REAL_ESTATE_MONGO_URI, REAL_ESTATE_DB_NAME } = require("../config/database");

async function seedUsers() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(REAL_ESTATE_MONGO_URI, {
      dbName: REAL_ESTATE_DB_NAME,
    });
    console.log("✅ Connected to MongoDB");

    // Xóa users cũ nếu muốn (tùy chọn)
    // await User.deleteMany({ email: { $in: ["user@gmail.com", "admin@gmail.com"] } });

    // Tạo User
    const userEmail = "user@gmail.com";
    const userPassword = "user@123";
    const existingUser = await User.findOne({ email: userEmail });
    
    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash(userPassword, 10);
      const newUser = await User.create({
        name: "Người Dùng",
        email: userEmail,
        password: hashedUserPassword,
        phone: 123456789,
        address: "Việt Nam",
        isAdmin: false,
      });
      console.log("✅ Created User:", newUser.email);
    } else {
      console.log("ℹ️  User already exists:", userEmail);
    }

    // Tạo Admin
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin@123";
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = await User.create({
        name: "Quản Trị Viên",
        email: adminEmail,
        password: hashedAdminPassword,
        phone: 987654321,
        address: "Việt Nam",
        isAdmin: true,
      });
      console.log("✅ Created Admin:", newAdmin.email);
    } else {
      console.log("ℹ️  Admin already exists:", adminEmail);
    }

    console.log("\n✅ Seed users completed!");
    console.log("\n📋 Accounts:");
    console.log("User:  user@gmail.com / user@123");
    console.log("Admin: admin@gmail.com / admin@123");
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedUsers();


const mongoose = require("mongoose");
const Vehicle = require("../model/VehicleModel");
const ServiceRecord = require("../model/ServiceRecord");
const crypto = require("crypto");

// Hardcode MongoDB connection
const MONGO_DB = "mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

async function connect() {
  await mongoose.connect(MONGO_DB);
}

function hashObject(obj) {
  const json = JSON.stringify(obj);
  return "0x" + crypto.createHash("sha256").update(json).digest("hex");
}

async function seedMaintenance() {
  await ServiceRecord.deleteMany({});
  
  const vehicles = await Vehicle.find().limit(20);
  if (vehicles.length === 0) {
    console.log("Chưa có xe nào. Chạy seed.js trước!");
    process.exit(1);
  }

  const garages = ["Garage ABC", "Garage XYZ", "Garage Đại Lộ", "Garage Quốc Lộ", "Garage Trung Tâm"];
  const jobs = [
    "Bảo dưỡng định kỳ",
    "Thay dầu động cơ",
    "Kiểm tra phanh",
    "Thay lọc gió",
    "Sửa chữa thân xe",
    "Bảo dưỡng hệ thống làm mát",
    "Thay phụ tùng",
    "Kiểm tra hệ thống điện",
  ];
  const technicians = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"];

  const records = [];
  
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    const maintenanceCount = Math.floor(Math.random() * 5) + 2; // 2-6 records per vehicle
    
    for (let j = 0; j < maintenanceCount; j++) {
      const odo = Math.floor(Math.random() * 150000) + 10000;
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const garage = garages[Math.floor(Math.random() * garages.length)];
      const technician = technicians[Math.floor(Math.random() * technicians.length)];
      const cost = Math.floor(Math.random() * 5000000) + 500000;
      
      // Tạo date cách nhau vài tháng
      const date = new Date();
      date.setMonth(date.getMonth() - (maintenanceCount - j) * 2);
      date.setDate(Math.floor(Math.random() * 28) + 1);
      
      const content = {
        odo,
        job,
        garage,
        technician,
        cost,
        note: `Bảo dưỡng định kỳ lần ${j + 1}`,
        date: date.toISOString().split("T")[0],
        parts: j % 2 === 0 ? ["Lọc dầu", "Dầu động cơ", "Lọc gió"] : ["Phanh trước", "Nước làm mát"],
      };
      
      const contentHash = hashObject(content);
      
      // Một số đã xác thực, một số chưa
      const anchored = Math.random() > 0.4; // 60% đã xác thực
      const txHash = anchored ? `0x${crypto.randomBytes(16).toString("hex")}` : null;
      const blockNumber = anchored ? Math.floor(Math.random() * 1000000) + 1000000 : null;
      
      records.push({
        vehicle: vehicle._id,
        vehicleKey: vehicle.plates,
        content,
        contentHash,
        anchored,
        txHash,
        blockNumber,
        createdAt: date,
        updatedAt: date,
      });
    }
  }
  
  await ServiceRecord.insertMany(records);
  console.log(`✅ Đã seed ${records.length} bản ghi bảo trì cho ${vehicles.length} xe`);
  console.log(`   - Đã xác thực: ${records.filter(r => r.anchored).length}`);
  console.log(`   - Chưa xác thực: ${records.filter(r => !r.anchored).length}`);
}

connect()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return seedMaintenance();
  })
  .then(() => {
    console.log("✅ Seed maintenance completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });


const mongoose = require("mongoose");
const Vehicle = require("../model/VehicleModel");
const ServiceRecord = require("../model/ServiceRecord");
const crypto = require("crypto");

// Hardcode MongoDB connection
const MONGO_DB = "mongodb+srv://admin:admin@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

async function connect() {
  await mongoose.connect(MONGO_DB);
}

function hashObject(obj) {
  const json = JSON.stringify(obj);
  return "0x" + crypto.createHash("sha256").update(json).digest("hex");
}

async function seedMaintenance() {
  // Xóa toàn bộ service records cũ
  await ServiceRecord.deleteMany({});
  
  const vehicles = await Vehicle.find().limit(100);
  if (vehicles.length === 0) {
    console.log("❌ Chưa có xe nào. Chạy seed.js trước!");
    process.exit(1);
  }

  // Dữ liệu thực tế cho xe vận tải
  const garages = [
    "Garage Hải Phòng", 
    "Garage Quốc Lộ 5", 
    "Garage Đại Lộ Bắc Nam",
    "Garage Trung Tâm TP.HCM",
    "Garage Cảng Sài Gòn",
    "Garage Xe Tải Miền Bắc",
    "Garage Container Hải An",
    "Garage Xe Khách Liên Tỉnh",
    "Garage Dịch Vụ Nhanh",
    "Garage Chuyên Nghiệp"
  ];

  // Các công việc bảo trì phù hợp với xe vận tải
  const maintenanceJobs = [
    { job: "Bảo dưỡng định kỳ", baseCost: 2000000, baseOdo: 10000, interval: 10000 },
    { job: "Thay dầu động cơ", baseCost: 800000, baseOdo: 5000, interval: 10000 },
    { job: "Thay lọc dầu", baseCost: 300000, baseOdo: 5000, interval: 10000 },
    { job: "Thay lọc gió", baseCost: 200000, baseOdo: 10000, interval: 20000 },
    { job: "Kiểm tra và bảo dưỡng phanh", baseCost: 1500000, baseOdo: 20000, interval: 30000 },
    { job: "Thay má phanh trước", baseCost: 1200000, baseOdo: 30000, interval: 40000 },
    { job: "Thay má phanh sau", baseCost: 1000000, baseOdo: 30000, interval: 40000 },
    { job: "Bảo dưỡng hệ thống làm mát", baseCost: 1000000, baseOdo: 15000, interval: 30000 },
    { job: "Thay nước làm mát", baseCost: 500000, baseOdo: 15000, interval: 20000 },
    { job: "Kiểm tra hệ thống điện", baseCost: 600000, baseOdo: 10000, interval: 20000 },
    { job: "Thay ắc quy", baseCost: 2000000, baseOdo: 50000, interval: 80000 },
    { job: "Bảo dưỡng hộp số", baseCost: 2500000, baseOdo: 40000, interval: 60000 },
    { job: "Thay dầu hộp số", baseCost: 800000, baseOdo: 40000, interval: 60000 },
    { job: "Kiểm tra và cân chỉnh lốp", baseCost: 300000, baseOdo: 10000, interval: 15000 },
    { job: "Thay lốp xe", baseCost: 5000000, baseOdo: 80000, interval: 100000 },
    { job: "Sửa chữa thân xe", baseCost: 3000000, baseOdo: null, interval: null },
    { job: "Sơn lại xe", baseCost: 8000000, baseOdo: null, interval: null },
    { job: "Kiểm tra hệ thống lái", baseCost: 800000, baseOdo: 25000, interval: 50000 },
    { job: "Bảo dưỡng hệ thống treo", baseCost: 2000000, baseOdo: 50000, interval: 80000 },
    { job: "Vệ sinh và bảo dưỡng cabin", baseCost: 500000, baseOdo: 20000, interval: 40000 }
  ];

  const technicians = [
    "Nguyễn Văn Trường",
    "Trần Minh Hải", 
    "Lê Đức Anh",
    "Phạm Thành Đạt",
    "Hoàng Văn Cường",
    "Vũ Đình Phong",
    "Đỗ Minh Tuấn",
    "Bùi Văn Thắng",
    "Ngô Thanh Sơn",
    "Võ Hoàng Nam"
  ];

  // Phụ tùng thường dùng cho xe vận tải
  const partsCategories = {
    "Thay dầu động cơ": ["Dầu động cơ 15W-40", "Lọc dầu", "Vệ sinh máy"],
    "Thay lọc dầu": ["Lọc dầu chính hãng", "Dầu thừa"],
    "Thay lọc gió": ["Lọc gió động cơ", "Lọc gió cabin"],
    "Kiểm tra và bảo dưỡng phanh": ["Má phanh trước", "Má phanh sau", "Dầu phanh DOT 4"],
    "Thay má phanh trước": ["Má phanh trước", "Dầu phanh", "Lốc xoáy phanh"],
    "Thay má phanh sau": ["Má phanh sau", "Dầu phanh"],
    "Bảo dưỡng hệ thống làm mát": ["Nước làm mát", "Van nhiệt", "Ống dẫn nước"],
    "Thay nước làm mát": ["Nước làm mát chống đông", "Phụ gia"],
    "Kiểm tra hệ thống điện": ["Bugi", "Dây cao áp", "Bộ điều khiển"],
    "Thay ắc quy": ["Ắc quy 12V 100Ah", "Dây kẹp"],
    "Bảo dưỡng hộp số": ["Dầu hộp số", "Lọc dầu hộp số", "Gioăng"],
    "Thay dầu hộp số": ["Dầu hộp số ATF", "Lọc dầu"],
    "Kiểm tra và cân chỉnh lốp": ["Cân chỉnh góc camber", "Cân chỉnh góc caster"],
    "Thay lốp xe": ["Lốp 10.00R20", "Vành", "Ốp van"],
    "Sửa chữa thân xe": ["Tôn", "Sơn", "Phụ kiện"],
    "Sơn lại xe": ["Sơn nền", "Sơn phủ", "Chất phụ gia"],
    "Kiểm tra hệ thống lái": ["Dầu lái trợ lực", "Ống dẫn dầu", "Van điều khiển"],
    "Bảo dưỡng hệ thống treo": ["Nhíp lá", "Giảm xóc", "Đệm cao su"],
    "Vệ sinh và bảo dưỡng cabin": ["Lọc gió cabin", "Vệ sinh nội thất"]
  };

  const records = [];
  
  // Tạo dữ liệu bảo trì cho từng xe
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    // Mỗi xe có 3-8 lần bảo trì, tùy thuộc vào loại xe
    const maintenanceCount = Math.floor(Math.random() * 6) + 3;
    
    // Odometer ban đầu của xe (giả sử xe đã chạy được một khoảng)
    let currentOdo = Math.floor(Math.random() * 50000) + 20000;
    
    for (let j = 0; j < maintenanceCount; j++) {
      // Chọn công việc bảo trì ngẫu nhiên
      const jobData = maintenanceJobs[Math.floor(Math.random() * maintenanceJobs.length)];
      const garage = garages[Math.floor(Math.random() * garages.length)];
      const technician = technicians[Math.floor(Math.random() * technicians.length)];
      
      // Tính odo dựa trên công việc và số lần bảo trì
      if (jobData.interval) {
        currentOdo += jobData.interval + Math.floor(Math.random() * 5000) - 2500;
      } else {
        // Công việc không theo km (sửa chữa, sơn)
        currentOdo += Math.floor(Math.random() * 10000) + 5000;
      }
      
      // Tính chi phí dựa trên base cost + random
      const cost = jobData.baseCost + Math.floor(Math.random() * jobData.baseCost * 0.3);
      
      // Tạo ngày bảo trì (cách nhau vài tháng)
      const date = new Date();
      date.setMonth(date.getMonth() - (maintenanceCount - j) * 3);
      date.setDate(Math.floor(Math.random() * 28) + 1);
      date.setHours(Math.floor(Math.random() * 8) + 8); // Từ 8h-16h
      date.setMinutes(Math.floor(Math.random() * 60));
      
      // Lấy phụ tùng tương ứng với công việc
      const parts = partsCategories[jobData.job] || ["Phụ tùng khác"];
      
      // Tạo note có ý nghĩa
      const notes = [
        `${jobData.job} tại ${garage}. Tất cả hoạt động bình thường.`,
        `${jobData.job} hoàn thành. Xe hoạt động tốt.`,
        `${jobData.job} - Không phát hiện sự cố.`,
        `${jobData.job} - Thay thế phụ tùng như kế hoạch.`,
        `${jobData.job} - Xe cần theo dõi thêm trong 1000km tiếp theo.`
      ];
      
      const content = {
        odo: currentOdo,
        job: jobData.job,
        garage,
        technician,
        cost,
        note: notes[Math.floor(Math.random() * notes.length)],
        date: date.toISOString().split("T")[0],
        parts: Math.random() > 0.3 ? parts : ["Không có"],
      };
      
      const contentHash = hashObject(content);
      
      // KHÔNG seed blockchain - tất cả records chưa xác thực
      // User sẽ phải xác thực thủ công qua UI
      records.push({
        vehicle: vehicle._id,
        vehicleKey: vehicle.plates,
        content,
        contentHash,
        anchored: false, // Tất cả đều chưa xác thực
        txHash: null,    // Không có transaction hash
        blockNumber: null, // Không có block number
        createdAt: date,
        updatedAt: date,
      });
    }
  }
  
  await ServiceRecord.insertMany(records);
  console.log(`✅ Đã seed ${records.length} bản ghi bảo trì cho ${vehicles.length} xe`);
  console.log(`   - Tất cả đều chưa xác thực blockchain (cần xác thực thủ công)`);
  console.log(`   - Dữ liệu phù hợp với quản lý bảo trì xe vận tải`);
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

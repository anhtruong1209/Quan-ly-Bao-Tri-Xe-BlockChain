const mongoose = require("mongoose");
const Vehicle = require("../model/VehicleModel");

// Hardcode MongoDB connection
const MONGO_DB = "mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

async function connect() {
  await mongoose.connect(MONGO_DB);
}

async function seed() {
  // Xóa toàn bộ dữ liệu xe cũ
  await Vehicle.deleteMany({});

  // Dữ liệu xe vận tải thực tế
  const vehicleTypes = [
    "Xe Tải Nhẹ", "Xe Tải Trung", "Xe Tải Nặng", 
    "Xe Container", "Xe Đầu Kéo", "Xe Khách Liên Tỉnh",
    "Xe Chở Hàng", "Xe Chuyên Dụng", "Xe Ben", "Xe Xitec"
  ];
  
  const fuels = ["Dầu Diesel", "Xăng", "Gas", "Hybrid"];
  const gears = ["Số Sàn", "Số Tự Động", "Số Tự Động 8 Cấp"];
  const rollings = ["Cầu Sau", "4 Bánh", "6 Bánh", "8 Bánh", "10 Bánh"];
  const colors = ["Trắng", "Đỏ", "Xanh Dương", "Vàng Cam", "Xám", "Đen"];
  
  // Hãng xe vận tải phổ biến
  const brands = [
    "Hyundai", "Hino", "Isuzu", "Fuso", "Tata", "Dongfeng",
    "JAC", "Howo", "Thaco", "VinFast", "Ford", "Mercedes",
    "Volvo", "Scania", "MAN"
  ];

  // Tên chủ xe vận tải thực tế
  const ownerNames = [
    "Công Ty Vận Tải Hải Phòng",
    "Doanh Nghiệp Logistics Sài Gòn",
    "Tổng Công Ty Vận Tải Miền Bắc",
    "Công Ty Xe Container Đông Nam",
    "Doanh Nghiệp Vận Chuyển Liên Tỉnh",
    "Công Ty Logistics Quốc Lộ",
    "Doanh Nghiệp Vận Tải Cảng Biển",
    "Công Ty Chở Hàng Nội Địa",
    "Doanh Nghiệp Vận Tải Đa Phương Thức",
    "Công Ty Logistics Toàn Quốc"
  ];

  // Địa chỉ thực tế
  const addresses = [
    "Hải Phòng, Việt Nam",
    "Hà Nội, Việt Nam", 
    "TP. Hồ Chí Minh, Việt Nam",
    "Đà Nẵng, Việt Nam",
    "Cần Thơ, Việt Nam",
    "Hải Dương, Việt Nam",
    "Quảng Ninh, Việt Nam",
    "Bắc Ninh, Việt Nam",
    "Bình Dương, Việt Nam",
    "Đồng Nai, Việt Nam"
  ];

  // Mô tả xe vận tải
  const descriptions = [
    "Xe tải chuyên dụng vận chuyển hàng hóa nội địa",
    "Xe container phục vụ vận chuyển hàng hóa xuất nhập khẩu",
    "Xe đầu kéo chuyên dụng cho container 40 feet",
    "Xe tải chở hàng nặng, tải trọng lớn",
    "Xe khách liên tỉnh phục vụ vận chuyển hành khách",
    "Xe chuyên dụng phục vụ ngành xây dựng",
    "Xe ben chở vật liệu xây dựng, đất đá"
  ];

  function rand(arr) { 
    return arr[Math.floor(Math.random() * arr.length)]; 
  }
  
  function pad(n, len = 3) { 
    return String(n).padStart(len, "0"); 
  }

  const many = [];
  const COUNT = 150; // Tăng số lượng xe lên 150

  // Tạo các biển số theo từng khu vực
  const provinces = [
    { code: "30A", name: "Hải Phòng", count: 30 },
    { code: "30G", name: "Hải Phòng", count: 25 },
    { code: "51H", name: "Hà Nội", count: 35 },
    { code: "43A", name: "Đà Nẵng", count: 20 },
    { code: "75A", name: "TP.HCM", count: 25 },
    { code: "65C", name: "Cần Thơ", count: 15 }
  ];

  let plateCounter = {};
  provinces.forEach(p => {
    plateCounter[p.code] = 0;
  });

  for (let i = 1; i <= COUNT; i++) {
    const provinceIndex = i % provinces.length;
    const province = provinces[provinceIndex];
    plateCounter[province.code]++;
    
    const plateNumber = pad(100 + (plateCounter[province.code] % 900), 3);
    const subNumber = pad(10 + (plateCounter[province.code] % 90), 2);
    const plate = `${province.code}-${plateNumber}.${subNumber}`;
    
    // Gán tên chủ xe và địa chỉ theo khu vực
    const ownerIndex = i % ownerNames.length;
    const ownerName = ownerNames[ownerIndex];
    const address = addresses[provinceIndex];

    many.push({
      name: `${ownerName} ${plateCounter[province.code]}`,
      image: [
        `https://picsum.photos/id/${240 + (i % 50)}/800/600`
      ],
      identifynumber: `VIN-${province.code}-${pad(i, 6)}`,
      dated: new Date(2020 + (i % 5), (i % 12), (i % 28) + 1),
      email: `vehicle${i}@transport.vn`,
      phone: `09${pad(1000000 + i, 7)}`,
      address: address,
      plates: plate,
      bill: `HD-${2020 + (i % 6)}-${pad(i, 5)}`,
      tax: `TAX-${2020 + (i % 6)}-${pad(i, 5)}`,
      seri: `SERI-${province.code}-${pad(i, 4)}`,
      license: `LIC-${province.code}-${pad(i, 4)}`,
      engine: `ENG-${pad(i, 6)}`,
      frame: `FRM-${pad(i, 6)}`,
      fuel: rand(fuels),
      type: rand(vehicleTypes),
      color: rand(colors),
      brand: rand(brands),
      rolling: rand(rollings),
      gear: rand(gears),
      description: rand(descriptions)
    });
  }

  await Vehicle.insertMany(many);
  console.log(`✅ Đã seed ${COUNT} xe vận tải thành công!`);
  console.log(`   - Dữ liệu phù hợp với quản lý bảo trì xe vận tải`);
}

connect()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return seed();
  })
  .then(() => {
    console.log("✅ Seed vehicles completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });

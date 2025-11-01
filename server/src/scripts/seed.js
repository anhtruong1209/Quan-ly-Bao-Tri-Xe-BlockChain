const mongoose = require("mongoose");
const Vehicle = require("../model/VehicleModel");

// Hardcode MongoDB connection
const MONGO_DB = "mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

async function connect() {
  await mongoose.connect(MONGO_DB);
}

async function seed() {
  // Xóa toàn bộ dữ liệu xe cũ, chỉ seed xe
  await Vehicle.deleteMany({});

  // Tạo bộ dữ liệu xe giả lập ~100 bản ghi
  const types = [
    "SUV", "Sedan", "Hatchback", "Crossover", "Pickup", "Coupe", "MPV", "Van"
  ];
  const fuels = ["Xăng", "Dầu", "Điện", "Hybrid"];
  const gears = ["AT", "MT", "CVT", "DCT"];
  const rollings = ["FWD", "RWD", "AWD", "4WD"];
  const colors = ["Trắng", "Đen", "Bạc", "Xám", "Đỏ", "Xanh", "Vàng"];
  const brands = [
    "Toyota", "Honda", "Hyundai", "Kia", "Mercedes", "BMW", "Audi", "Porsche", "VinFast", "Ford", "Mazda", "Nissan", "Mitsubishi", "Lexus"
  ];

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function pad(n, len = 3) { return String(n).padStart(len, "0"); }

  const many = [];
  const COUNT = 100; // Hardcode số lượng xe seed
  for (let i = 1; i <= COUNT; i++) {
    const province = ["30A", "30G", "51H", "43A", "75A", "65C"][i % 6];
    const plate = `${province}-${pad(100 + (i % 900), 3)}.${pad(10 + (i % 90), 2)}`;
    many.push({
      name: `Owner ${i}`,
      image: [
        `https://picsum.photos/id/${240 + (i % 50)}/800/600`
      ],
      identifynumber: `ID-${String(100000 + i)}`,
      dated: new Date(2020 + (i % 5), (i % 12), (i % 28) + 1),
      email: `owner${i}@example.com`,
      phone: `09${pad(100000 + i, 7)}`,
      address: ["Hanoi", "HCMC", "Da Nang", "Hue", "Can Tho"][i % 5] + ", Vietnam",
      plates: plate,
      bill: `HD-${2020 + (i % 6)}-${pad(i, 3)}`,
      tax: `TAX-${2020 + (i % 6)}-${pad(i, 3)}`,
      seri: `SERI-${pad(i, 3)}`,
      license: `LIC-${pad(i, 3)}`,
      engine: `ENG-${pad(i, 3)}`,
      frame: `FRM-${pad(i, 3)}`,
      fuel: rand(fuels),
      type: rand(types),
      color: rand(colors),
      brand: rand(brands),
      rolling: rand(rollings),
      gear: rand(gears),
      description: "Dữ liệu demo đồng bộ FE/BE"
    });
  }

  await Vehicle.insertMany(many);
}

connect()
  .then(seed)
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });



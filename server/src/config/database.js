// Cấu hình database
// Cùng 1 cluster nhưng khác database name
const MONGO_CLUSTER_BASE = "mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net";

// Database names
const VEHICLE_DB_NAME = "warrantly-verhical"; // Database cho bảo trì xe
const REAL_ESTATE_DB_NAME = "giaodich-bds"; // Database cho giao dịch bất động sản

// Tạo connection string với database name và query params
const VEHICLE_MONGO_URI = `${MONGO_CLUSTER_BASE}/${VEHICLE_DB_NAME}?appName=warrantly-verhical`;
const REAL_ESTATE_MONGO_URI = `${MONGO_CLUSTER_BASE}/${REAL_ESTATE_DB_NAME}?appName=realestate-management`;

module.exports = {
  MONGO_CLUSTER_BASE,
  VEHICLE_DB_NAME,
  REAL_ESTATE_DB_NAME,
  VEHICLE_MONGO_URI,
  REAL_ESTATE_MONGO_URI,
};


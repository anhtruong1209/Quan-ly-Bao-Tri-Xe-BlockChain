const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const cors = require("cors");

// Nhận và gửi request từ thanh body, gửi data
const bodyParse = require("body-parser");
const app = express();
const port = 3001;

const { REAL_ESTATE_MONGO_URI, REAL_ESTATE_DB_NAME } = require("./config/database");

app.use(cors());
app.use(bodyParse.json());
routes(app);

// Kết nối MongoDB cho Bất động sản (cùng cluster, khác database)
mongoose
  .connect(REAL_ESTATE_MONGO_URI, {
    dbName: REAL_ESTATE_DB_NAME, // Chỉ định database name
  })
  .then(() => {
    console.log(`✅ Connected to RealEstate MongoDB successfully (Database: ${REAL_ESTATE_DB_NAME})`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.listen(port, () => {
  console.log("Server is running at: ", port);
});

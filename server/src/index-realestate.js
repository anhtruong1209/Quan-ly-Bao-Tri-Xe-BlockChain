const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParse = require("body-parser");
const { REAL_ESTATE_MONGO_URI, REAL_ESTATE_DB_NAME } = require("./config/database");

const app = express();
const port = 3001; // Port chính cho Real Estate server

app.use(cors());
app.use(bodyParse.json());

// Chỉ load routes cho Real Estate
const RealEstateRouter = require("./routes/RealEstateRouter");
const TransactionRouter = require("./routes/TransactionRouter");
const UserRouter = require("./routes/UserRouter"); // User vẫn dùng chung

app.use('/api/user', UserRouter);
app.use('/api/realestate', RealEstateRouter);
app.use('/api/transaction', TransactionRouter);

// Kết nối MongoDB cho Real Estate (cùng cluster, khác database)
mongoose
  .connect(REAL_ESTATE_MONGO_URI, {
    dbName: REAL_ESTATE_DB_NAME, // Chỉ định database name
  })
  .then(() => {
    console.log(`✅ Connected to Real Estate MongoDB successfully (Database: ${REAL_ESTATE_DB_NAME})`);
  })
  .catch((err) => {
    console.error("❌ Real Estate MongoDB connection error:", err.message);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Real Estate Server is running at: http://localhost:${port}`);
});


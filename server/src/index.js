const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const path = require("path");
const fs = require("fs");

const cors = require("cors");

// Nhận và gửi request từ thanh body, gửi data
const bodyParse = require("body-parser");
const app = express();
const port = process.env.PORT || 3001;

// Hardcode MongoDB connection string
const MONGO_DB = "mongodb+srv://admin:admin@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

app.use(cors());
app.use(bodyParse.json());

// Connect MongoDB với error handling tốt hơn cho serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(MONGO_DB);
    isConnected = true;
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // Không exit process trong serverless, chỉ log error
    if (require.main === module) {
      process.exit(1);
    }
  }
};

// Connect DB ngay khi app start (async, không block)
connectDB();

// API Routes only - Vercel sẽ serve static files riêng
routes(app);

// Chỉ xử lý API routes, không serve static files trong Vercel
// Vercel sẽ tự động serve frontend build từ Output Directory (public hoặc client/dist)
// Không cần serve static files trong serverless function

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message
  });
});

// Export app for Vercel serverless
if (require.main === module) {
  // Chạy server thông thường (local hoặc Render/Railway)
  app.listen(port, () => {
    console.log("🚀 Server is running at port:", port);
    console.log("📡 API endpoints: http://localhost:" + port + "/api");
    console.log("🌐 Frontend: http://localhost:" + port);
  });
} else {
  // Export cho Vercel serverless - phải export handler function
  module.exports = app;
}

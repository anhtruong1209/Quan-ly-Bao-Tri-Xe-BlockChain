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
const MONGO_DB = "mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

app.use(cors());
app.use(bodyParse.json());

// API Routes - phải đặt trước static files
routes(app);

// Serve static files from React app (build folder)
// Ưu tiên tìm trong server/client/dist (sau khi copy), nếu không có thì dùng client/dist
const clientBuildPath = fs.existsSync(path.join(__dirname, "../client/dist"))
  ? path.join(__dirname, "../client/dist")
  : path.join(__dirname, "../../client/dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  console.log(`✅ Serving static files from: ${clientBuildPath}`);
} else {
  console.warn(`⚠️  Static files not found at: ${clientBuildPath}`);
}

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

mongoose
  .connect(MONGO_DB)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
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
  // Export cho Vercel serverless
  module.exports = app;
}

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const cors = require("cors");

// Nhận và gửi request từ thanh body, gửi data
const bodyParse = require("body-parser");
const app = express();
const port = 3001;

// Hardcode MongoDB connection string
const MONGO_DB = "mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net/?appName=warrantly-verhical";

app.use(cors());
app.use(bodyParse.json());
routes(app);

mongoose
  .connect(MONGO_DB)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.listen(port, () => {
  console.log("Server is running at: ", port);
});

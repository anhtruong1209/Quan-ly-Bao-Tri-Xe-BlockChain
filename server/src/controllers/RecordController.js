const crypto = require("crypto");
const Vehicle = require("../model/VehicleModel");
const ServiceRecord = require("../model/ServiceRecord");
const WarrantyClaim = require("../model/WarrantyClaim");
const Blockchain = require("../services/BlockchainService");

function hashObject(obj) {
  const json = JSON.stringify(obj);
  return "0x" + crypto.createHash("sha256").update(json).digest("hex");
}

const createServiceRecord = async (req, res) => {
  try {
    const userId = req.user?.id; // Từ middleware auth
    const { vehicleId, vehicleKey, content } = req.body;
    if (!vehicleId || !vehicleKey || !content) {
      return res.status(400).json({ status: "ERR", message: "Missing fields" });
    }
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ status: "ERR", message: "Vehicle not found" });

    // Kiểm tra user có quyền sở hữu vehicle không (nếu có user)
    if (userId && vehicle.email && vehicle.email !== req.user?.email) {
      return res.status(403).json({ status: "ERR", message: "You don't own this vehicle" });
    }

    const contentHash = hashObject(content);
    // Tạo record với status pending - chờ admin duyệt
    const record = await ServiceRecord.create({
      vehicle: vehicle._id,
      vehicleKey,
      user: userId || vehicle.user, // User tạo lệnh
      content,
      contentHash,
      status: "pending", // Mặc định là pending, chờ admin duyệt
      anchored: false,
    });

    // KHÔNG gọi blockchain ở đây - chỉ khi admin approve mới đưa lên blockchain
    return res.status(200).json({ status: "OK", data: record });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const listServiceRecords = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.isAdmin;
    const { vehicleId, status } = req.query;
    
    let filter = {};
    if (vehicleId) filter.vehicle = vehicleId;
    if (status) filter.status = status;
    
    // User chỉ xem được records của mình, admin xem tất cả
    if (!isAdmin && userId) {
      filter.user = userId;
    }
    
    const items = await ServiceRecord.find(filter)
      .populate("vehicle")
      .populate("user", "name email phone")
      .populate("approver", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: "OK", data: items });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

// Lấy danh sách service records chờ duyệt (cho admin)
const getPendingServiceRecords = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ status: "ERR", message: "Admin access required" });
    }
    
    const items = await ServiceRecord.find({ status: "pending" })
      .populate("vehicle")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: "OK", data: items });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

// Admin approve service record (chỉ duyệt, không đưa lên blockchain)
const approveServiceRecord = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ status: "ERR", message: "Admin access required" });
    }
    
    const { id } = req.params;
    const { garage } = req.body; // Nhận garage từ body
    
    const record = await ServiceRecord.findById(id);
    
    if (!record) {
      return res.status(404).json({ status: "ERR", message: "Service record not found" });
    }
    
    if (record.status !== "pending") {
      return res.status(400).json({ status: "ERR", message: "Record already processed" });
    }
    
    // Chỉ duyệt, không đưa lên blockchain (blockchain sẽ được gọi khi xác thực)
    record.status = "approved";
    record.approved = true;
    record.processed = true;
    record.approver = req.user.id;
    
    // Cập nhật garage nếu có
    if (garage) {
      if (!record.content) record.content = {};
      record.content.garage = garage;
      // Cập nhật lại contentHash vì content đã thay đổi
      const crypto = require("crypto");
      const hashObject = (obj) => {
        const json = JSON.stringify(obj);
        return "0x" + crypto.createHash("sha256").update(json).digest("hex");
      };
      record.contentHash = hashObject(record.content);
    }
    
    await record.save();
    return res.status(200).json({ status: "OK", data: record });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

// Admin reject service record
const rejectServiceRecord = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ status: "ERR", message: "Admin access required" });
    }
    
    const { id } = req.params;
    const record = await ServiceRecord.findById(id);
    
    if (!record) {
      return res.status(404).json({ status: "ERR", message: "Service record not found" });
    }
    
    if (record.status !== "pending") {
      return res.status(400).json({ status: "ERR", message: "Record already processed" });
    }
    
    record.status = "rejected";
    record.approved = false;
    record.processed = true;
    record.approver = req.user.id;
    await record.save();
    
    return res.status(200).json({ status: "OK", data: record });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const createWarrantyClaim = async (req, res) => {
  try {
    const { vehicleId, vehicleKey, content } = req.body;
    if (!vehicleId || !vehicleKey || !content) {
      return res.status(400).json({ status: "ERR", message: "Missing fields" });
    }
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ status: "ERR", message: "Vehicle not found" });
    const contentHash = hashObject(content);
    const claim = await WarrantyClaim.create({
      vehicle: vehicle._id,
      vehicleKey,
      content,
      contentHash,
      status: "created",
    });
    const bc = await Blockchain.createWarrantyClaim(vehicleKey, contentHash);
    claim.txHash = bc.txHash;
    claim.blockNumber = bc.blockNumber;
    await claim.save();
    return res.status(200).json({ status: "OK", data: claim });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const resolveWarrantyClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, resolution } = req.body;
    const claim = await WarrantyClaim.findById(id);
    if (!claim) return res.status(404).json({ status: "ERR", message: "Claim not found" });
    const resolutionHash = resolution ? hashObject(resolution) : undefined;
    const bc = await Blockchain.resolveWarrantyClaim(claim._id.toString(), !!approved, resolutionHash);
    claim.status = "resolved";
    claim.approved = !!approved;
    claim.resolution = resolution || null;
    claim.resolutionHash = resolutionHash;
    claim.txHash = bc.txHash;
    claim.blockNumber = bc.blockNumber;
    await claim.save();
    return res.status(200).json({ status: "OK", data: claim });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const listWarrantyClaims = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const filter = vehicleId ? { vehicle: vehicleId } : {};
    const items = await WarrantyClaim.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ status: "OK", data: items });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const deleteServiceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await ServiceRecord.findByIdAndDelete(id);
    if (!record) {
      return res.status(404).json({ status: "ERR", message: "Record not found" });
    }
    return res.status(200).json({ status: "OK", message: "Record deleted successfully" });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const acceptServiceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await ServiceRecord.findById(id);
    if (!record) {
      return res.status(404).json({ status: "ERR", message: "Record not found" });
    }
    
    if (record.anchored) {
      return res.status(400).json({ status: "ERR", message: "Record already anchored" });
    }

    // Chỉ accept nếu record đã được approve hoặc đang ở trạng thái approved/anchored nhưng chưa anchored
    if (record.status === "pending") {
      return res.status(400).json({ status: "ERR", message: "Record must be approved before anchoring" });
    }

    // Anchor lên blockchain
    try {
      const bc = await Blockchain.anchorServiceRecord(record.vehicleKey, record.contentHash);
      record.anchored = true;
      record.status = "anchored";
      record.txHash = bc.txHash;
      record.blockNumber = bc.blockNumber;
      await record.save();
      return res.status(200).json({ status: "OK", data: record });
    } catch (blockchainError) {
      console.error("Blockchain error:", blockchainError);
      
      // Kiểm tra nếu lỗi là "not garage"
      if (blockchainError.reason === "not garage" || blockchainError.message?.includes("not garage")) {
        return res.status(500).json({ 
          status: "ERR", 
          message: `Blockchain error: Wallet không có quyền garage. Vui lòng chạy script setGarageRole để cấp quyền cho wallet. Chi tiết: ${blockchainError.message}` 
        });
      }
      
      return res.status(500).json({ status: "ERR", message: `Blockchain error: ${blockchainError.message}` });
    }
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

module.exports = {
  createServiceRecord,
  listServiceRecords,
  getPendingServiceRecords,
  approveServiceRecord,
  rejectServiceRecord,
  createWarrantyClaim,
  resolveWarrantyClaim,
  listWarrantyClaims,
  deleteServiceRecord,
  acceptServiceRecord,
};



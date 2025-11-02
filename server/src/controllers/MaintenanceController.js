const MaintenanceRegistration = require("../model/MaintenanceRegistration");
const Vehicle = require("../model/VehicleModel");
const ServiceRecord = require("../model/ServiceRecord");
const BlockchainService = require("../services/BlockchainService");
const crypto = require("crypto");

// Helper function để tính hash
const calculateHash = (data) => {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
};

// User tạo lệnh đăng ký bảo trì
const createMaintenanceRegistration = async (req, res) => {
  try {
    const userId = req.user.id; // từ middleware auth
    const { vehicleId, content } = req.body;

    if (!vehicleId || !content) {
      return res.status(400).json({
        status: "ERR",
        message: "Vehicle ID and content are required",
      });
    }

    // Kiểm tra xe có tồn tại và thuộc về user
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        status: "ERR",
        message: "Vehicle not found",
      });
    }

    // Tính hash của content
    const contentHash = calculateHash(content);
    
    // Tạo vehicleId hash từ plate
    const vehicleIdHash = crypto
      .createHash("sha256")
      .update(vehicle.plates)
      .digest("hex");

    // Tạo registration trong database (chỉ lưu DB, không gọi blockchain)
    // Blockchain sẽ được gọi khi admin approve
    let registration = await MaintenanceRegistration.create({
      vehicle: vehicleId,
      vehicleId: vehicleIdHash,
      vehicleKey: vehicle.plates,
      user: userId,
      content,
      contentHash,
      status: "pending",
      // Không gọi blockchain ở đây - sẽ được gọi khi admin approve
    });

    return res.status(200).json({
      status: "OK",
      message: "Maintenance registration created successfully",
      data: registration,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Lấy danh sách đăng ký bảo trì của user
const getUserMaintenanceRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await MaintenanceRegistration.find({ user: userId })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "OK",
      data: registrations,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Lấy tất cả đăng ký bảo trì chờ xác nhận
const getPendingMaintenanceRegistrations = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        status: "ERR",
        message: "Admin access required",
      });
    }

    const registrations = await MaintenanceRegistration.find({
      status: "pending",
    })
      .populate("vehicle")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "OK",
      data: registrations,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Xác nhận đăng ký bảo trì
const approveMaintenanceRegistration = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        status: "ERR",
        message: "Admin access required",
      });
    }

    const { id } = req.params;
    const registration = await MaintenanceRegistration.findById(id);

    if (!registration) {
      return res.status(404).json({
        status: "ERR",
        message: "Registration not found",
      });
    }

    if (registration.status !== "pending") {
      return res.status(400).json({
        status: "ERR",
        message: "Registration already processed",
      });
    }

    // Cập nhật trong database
    registration.status = "approved";
    registration.approved = true;
    registration.processed = true;
    registration.approver = req.user.id;

    // Tạo ServiceRecord từ maintenance registration đã được approve
    let serviceRecord = null;
    try {
      serviceRecord = await ServiceRecord.create({
        vehicle: registration.vehicle,
        vehicleKey: registration.vehicleKey,
        content: registration.content,
        contentHash: registration.contentHash,
        anchored: false, // Sẽ được anchor sau khi blockchain confirm
      });

      // Đưa lên blockchain
      const bc = await BlockchainService.anchorServiceRecord(
        registration.vehicleKey,
        registration.contentHash
      );
      
      // Cập nhật ServiceRecord với thông tin blockchain
      serviceRecord.anchored = true;
      serviceRecord.txHash = bc.txHash;
      serviceRecord.blockNumber = bc.blockNumber;
      await serviceRecord.save();

      // Cập nhật maintenance registration với transaction hash từ blockchain
      registration.txHash = bc.txHash;
      registration.blockNumber = bc.blockNumber;
    } catch (blockchainError) {
      console.log("Blockchain error:", blockchainError);
      
      // Kiểm tra nếu lỗi là "not garage"
      if (blockchainError.reason === "not garage" || blockchainError.message?.includes("not garage")) {
        console.error("⚠️  Wallet không có quyền garage. Vui lòng chạy script setGarageRole để cấp quyền.");
      }
      // Nếu có ServiceRecord nhưng blockchain fail, đánh dấu chưa anchored
      if (serviceRecord) {
        serviceRecord.anchored = false;
        await serviceRecord.save();
      }
      // Vẫn cập nhật registration dù blockchain fail
    }

    await registration.save();

    return res.status(200).json({
      status: "OK",
      message: "Maintenance registration approved",
      data: registration,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Từ chối đăng ký bảo trì
const rejectMaintenanceRegistration = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        status: "ERR",
        message: "Admin access required",
      });
    }

    const { id } = req.params;
    const registration = await MaintenanceRegistration.findById(id);

    if (!registration) {
      return res.status(404).json({
        status: "ERR",
        message: "Registration not found",
      });
    }

    if (registration.status !== "pending") {
      return res.status(400).json({
        status: "ERR",
        message: "Registration already processed",
      });
    }

    registration.status = "rejected";
    registration.approved = false;
    registration.processed = true;
    registration.approver = req.user.id;

    // Gọi smart contract
    try {
      const tx = await BlockchainService.rejectMaintenanceRegistration(
        registration.regId
      );
      registration.txHash = tx.hash;
      registration.blockNumber = tx.blockNumber;
    } catch (blockchainError) {
      console.log("Blockchain error:", blockchainError);
    }

    await registration.save();

    return res.status(200).json({
      status: "OK",
      message: "Maintenance registration rejected",
      data: registration,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Lấy chi tiết đăng ký bảo trì
const getMaintenanceRegistrationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await MaintenanceRegistration.findById(id)
      .populate("vehicle")
      .populate("user", "name email phone")
      .populate("approver", "name email");

    if (!registration) {
      return res.status(404).json({
        status: "ERR",
        message: "Registration not found",
      });
    }

    // Kiểm tra quyền: user chỉ xem được của mình, admin xem được tất cả
    if (!req.user.isAdmin && registration.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        status: "ERR",
        message: "Access denied",
      });
    }

    return res.status(200).json({
      status: "OK",
      data: registration,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  createMaintenanceRegistration,
  getUserMaintenanceRegistrations,
  getPendingMaintenanceRegistrations,
  approveMaintenanceRegistration,
  rejectMaintenanceRegistration,
  getMaintenanceRegistrationDetails,
};


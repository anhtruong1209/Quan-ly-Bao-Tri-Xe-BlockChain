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
    const { vehicleId, vehicleKey, content } = req.body;
    if (!vehicleId || !vehicleKey || !content) {
      return res.status(400).json({ status: "ERR", message: "Missing fields" });
    }
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ status: "ERR", message: "Vehicle not found" });

    const contentHash = hashObject(content);
    const record = await ServiceRecord.create({
      vehicle: vehicle._id,
      vehicleKey,
      content,
      contentHash,
    });

    const bc = await Blockchain.anchorServiceRecord(vehicleKey, contentHash);
    record.anchored = true;
    record.txHash = bc.txHash;
    record.blockNumber = bc.blockNumber;
    await record.save();

    return res.status(200).json({ status: "OK", data: record });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const listServiceRecords = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const filter = vehicleId ? { vehicle: vehicleId } : {};
    const items = await ServiceRecord.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ status: "OK", data: items });
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

    // Anchor lên blockchain
    const bc = await Blockchain.anchorServiceRecord(record.vehicleKey, record.contentHash);
    record.anchored = true;
    record.txHash = bc.txHash;
    record.blockNumber = bc.blockNumber;
    await record.save();

    return res.status(200).json({ status: "OK", data: record });
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

module.exports = {
  createServiceRecord,
  listServiceRecords,
  createWarrantyClaim,
  resolveWarrantyClaim,
  listWarrantyClaims,
  deleteServiceRecord,
  acceptServiceRecord,
};



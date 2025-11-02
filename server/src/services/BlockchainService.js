const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const cfg = require("../config/blockchain");

let provider, wallet, contract;

function getContract() {
  if (contract) return contract;
  const rpcUrl = cfg.ETH_RPC_URL;
  const privateKey = cfg.WALLET_PRIVATE_KEY;
  const address = cfg.WARRANTY_CONTRACT_ADDRESS;
  provider = new ethers.JsonRpcProvider(rpcUrl);
  wallet = new ethers.Wallet(privateKey, provider);

  const abiPath = path.join(__dirname, "../../..", "smart_contract", "artifacts", "contracts", "VehicleWarrantyRegistry.sol", "VehicleWarrantyRegistry.json");
  let abi;
  if (fs.existsSync(abiPath)) {
    const artifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    abi = artifact.abi;
  } else {
    // Fallback minimal ABI with only used functions/events
    abi = [
      "function setGarage(address account, bool enabled)",
      "function setManufacturer(address account, bool enabled)",
      "function setAdmin(address account, bool enabled)",
      "function setUser(address account, bool enabled)",
      "function registerVehicle(bytes32 vehicleId, bytes32 contentHash)",
      "function createMaintenanceRegistration(bytes32 vehicleId, bytes32 contentHash) returns (uint256)",
      "function approveMaintenanceRegistration(uint256 regId)",
      "function rejectMaintenanceRegistration(uint256 regId)",
      "function anchorServiceRecord(bytes32 vehicleId, bytes32 contentHash)",
      "function createWarrantyClaim(bytes32 vehicleId, bytes32 contentHash) returns (uint256)",
      "function resolveWarrantyClaim(uint256 claimId, bool approved, bytes32 resolutionHash)",
      "event ServiceRecordAnchored(bytes32 indexed vehicleId, bytes32 indexed contentHash, address indexed garage, uint256 timestamp)",
      "event WarrantyClaimCreated(uint256 indexed claimId, bytes32 indexed vehicleId, bytes32 indexed contentHash, address requester)",
      "event WarrantyClaimResolved(uint256 indexed claimId, bool approved, bytes32 resolutionHash, address resolver)",
      "event VehicleRegistered(bytes32 indexed vehicleId, address indexed owner, bytes32 contentHash, uint256 timestamp)",
      "event MaintenanceRegistrationCreated(uint256 indexed regId, bytes32 indexed vehicleId, bytes32 contentHash, address indexed requester, uint256 timestamp)",
      "event MaintenanceRegistrationApproved(uint256 indexed regId, bytes32 indexed vehicleId, address indexed approver, uint256 timestamp)"
    ];
  }
  contract = new ethers.Contract(address, abi, wallet);
  return contract;
}

function toBytes32Hex(str) {
  if (!str) return ethers.ZeroHash;
  const hash = ethers.keccak256(ethers.toUtf8Bytes(str));
  return hash;
}

async function anchorServiceRecord(vehicleKey, contentHashHex) {
  const c = getContract();
  const vehicleId = toBytes32Hex(vehicleKey);
  const contentHash = contentHashHex || ethers.ZeroHash;
  const tx = await c.anchorServiceRecord(vehicleId, contentHash);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

async function createWarrantyClaim(vehicleKey, contentHashHex) {
  const c = getContract();
  const vehicleId = toBytes32Hex(vehicleKey);
  const tx = await c.createWarrantyClaim(vehicleId, contentHashHex || ethers.ZeroHash);
  const receipt = await tx.wait();
  // claimId is first event arg; parse logs for clarity if needed
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

async function resolveWarrantyClaim(claimId, approved, resolutionHashHex) {
  const c = getContract();
  const tx = await c.resolveWarrantyClaim(claimId, approved, resolutionHashHex || ethers.ZeroHash);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

// Hàm mới cho Vehicle Registration
async function registerVehicle(vehicleIdHex, contentHashHex) {
  const c = getContract();
  const tx = await c.registerVehicle(vehicleIdHex, contentHashHex || ethers.ZeroHash);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

// Hàm mới cho Maintenance Registration
async function createMaintenanceRegistration(vehicleIdHex, contentHashHex) {
  const c = getContract();
  const tx = await c.createMaintenanceRegistration(vehicleIdHex, contentHashHex || ethers.ZeroHash);
  const receipt = await tx.wait();
  
  // Parse event để lấy regId
  const event = receipt.logs.find(log => {
    try {
      const parsed = c.interface.parseLog(log);
      return parsed && parsed.name === "MaintenanceRegistrationCreated";
    } catch {
      return false;
    }
  });
  
  let regId = null;
  if (event) {
    try {
      const parsed = c.interface.parseLog(event);
      regId = parsed.args.regId ? parsed.args.regId.toString() : null;
    } catch (e) {
      console.log("Error parsing event:", e);
    }
  }
  
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber, regId };
}

// Admin approve maintenance registration
async function approveMaintenanceRegistration(regId) {
  const c = getContract();
  const tx = await c.approveMaintenanceRegistration(regId);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

// Admin reject maintenance registration
async function rejectMaintenanceRegistration(regId) {
  const c = getContract();
  const tx = await c.rejectMaintenanceRegistration(regId);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

module.exports = {
  anchorServiceRecord,
  createWarrantyClaim,
  resolveWarrantyClaim,
  registerVehicle,
  createMaintenanceRegistration,
  approveMaintenanceRegistration,
  rejectMaintenanceRegistration,
  toBytes32Hex,
};



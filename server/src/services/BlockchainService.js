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
      "function anchorServiceRecord(bytes32 vehicleId, bytes32 contentHash)",
      "function createWarrantyClaim(bytes32 vehicleId, bytes32 contentHash) returns (uint256)",
      "function resolveWarrantyClaim(uint256 claimId, bool approved, bytes32 resolutionHash)",
      "event ServiceRecordAnchored(bytes32 indexed vehicleId, bytes32 indexed contentHash, address indexed garage, uint256 timestamp)",
      "event WarrantyClaimCreated(uint256 indexed claimId, bytes32 indexed vehicleId, bytes32 indexed contentHash, address requester)",
      "event WarrantyClaimResolved(uint256 indexed claimId, bool approved, bytes32 resolutionHash, address resolver)"
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

module.exports = {
  anchorServiceRecord,
  createWarrantyClaim,
  resolveWarrantyClaim,
  toBytes32Hex,
};



const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const cfg = require("../config/blockchain");

let provider, wallet, contract;

function getContract() {
  if (contract) return contract;
  const rpcUrl = cfg.ETH_RPC_URL;
  const privateKey = cfg.WALLET_PRIVATE_KEY;
  const address = cfg.REAL_ESTATE_CONTRACT_ADDRESS;
  
  if (!address) {
    throw new Error("RealEstateRegistry contract address not found. Please deploy the contract first.");
  }

  provider = new ethers.JsonRpcProvider(rpcUrl);
  wallet = new ethers.Wallet(privateKey, provider);

  const abiPath = path.join(__dirname, "../../..", "smart_contract", "artifacts", "contracts", "RealEstateRegistry.sol", "RealEstateRegistry.json");
  let abi;
  if (fs.existsSync(abiPath)) {
    const artifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    abi = artifact.abi;
  } else {
    // Fallback minimal ABI
    abi = [
      "function registerProperty(bytes32 propertyId, bytes32 contentHash)",
      "function createTransaction(bytes32 propertyId, bytes32 contentHash) returns (uint256)",
      "function approveTransaction(uint256 transactionId)",
      "function rejectTransaction(uint256 transactionId)",
      "function anchorTransaction(bytes32 propertyId, bytes32 contentHash)",
      "function setAdmin(address account, bool enabled)",
      "function setUser(address account, bool enabled)",
      "function setNotary(address account, bool enabled)",
      "function setBroker(address account, bool enabled)",
      "event PropertyRegistered(bytes32 indexed propertyId, address indexed owner, bytes32 contentHash, uint256 timestamp)",
      "event TransactionCreated(uint256 indexed transactionId, bytes32 indexed propertyId, bytes32 contentHash, address indexed requester, uint256 timestamp)",
      "event TransactionApproved(uint256 indexed transactionId, bytes32 indexed propertyId, address indexed approver, uint256 timestamp)",
      "event TransactionRejected(uint256 indexed transactionId, bytes32 indexed propertyId, address indexed approver, uint256 timestamp)",
      "event TransactionAnchored(bytes32 indexed propertyId, bytes32 indexed contentHash, address indexed notary, uint256 timestamp)",
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

// Đăng ký BĐS lên blockchain
async function registerProperty(propertyCode, contentHashHex) {
  const c = getContract();
  const propertyId = toBytes32Hex(propertyCode);
  const contentHash = contentHashHex || ethers.ZeroHash;
  const tx = await c.registerProperty(propertyId, contentHash);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

// Tạo giao dịch trên blockchain
async function createTransaction(propertyCode, contentHashHex) {
  const c = getContract();
  const propertyId = toBytes32Hex(propertyCode);
  const contentHash = contentHashHex || ethers.ZeroHash;
  const tx = await c.createTransaction(propertyId, contentHash);
  const receipt = await tx.wait();
  
  // Parse event để lấy transactionId
  const event = receipt.logs.find(log => {
    try {
      const parsed = c.interface.parseLog(log);
      return parsed && parsed.name === "TransactionCreated";
    } catch {
      return false;
    }
  });
  
  let transactionId = null;
  if (event) {
    try {
      const parsed = c.interface.parseLog(event);
      transactionId = parsed.args.transactionId ? parsed.args.transactionId.toString() : null;
    } catch (e) {
      console.log("Error parsing event:", e);
    }
  }
  
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber, transactionId };
}

// Duyệt giao dịch
async function approveTransaction(transactionId) {
  const c = getContract();
  const tx = await c.approveTransaction(transactionId);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

// Từ chối giao dịch
async function rejectTransaction(transactionId) {
  const c = getContract();
  const tx = await c.rejectTransaction(transactionId);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

// Anchor transaction lên blockchain
async function anchorTransaction(propertyCode, contentHashHex) {
  const c = getContract();
  const propertyId = toBytes32Hex(propertyCode);
  const contentHash = contentHashHex || ethers.ZeroHash;
  const tx = await c.anchorTransaction(propertyId, contentHash);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

module.exports = {
  registerProperty,
  createTransaction,
  approveTransaction,
  rejectTransaction,
  anchorTransaction,
  toBytes32Hex,
};


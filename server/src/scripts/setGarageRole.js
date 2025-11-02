const { ethers } = require("ethers");
const cfg = require("../config/blockchain");
const fs = require("fs");
const path = require("path");

/**
 * Script để set garage role cho wallet trong server config
 * Cần chạy với owner wallet private key
 * 
 * Usage: node server/src/scripts/setGarageRole.js [ownerPrivateKey]
 */

async function main() {
  const ownerPrivateKey = process.argv[2];
  
  if (!ownerPrivateKey) {
    console.error("❌ Error: Owner private key is required");
    console.log("Usage: node server/src/scripts/setGarageRole.js <ownerPrivateKey>");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(cfg.ETH_RPC_URL);
  const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);
  
  // Wallet cần được set garage role (từ config)
  const garageWallet = new ethers.Wallet(cfg.WALLET_PRIVATE_KEY, provider);
  const garageAddress = garageWallet.address;
  
  console.log("📍 Contract Address:", cfg.WARRANTY_CONTRACT_ADDRESS);
  console.log("👤 Owner Address:", ownerWallet.address);
  console.log("🔧 Garage Address (will be set):", garageAddress);

  // Load ABI
  const abiPath = path.join(__dirname, "../../..", "smart_contract", "artifacts", "contracts", "VehicleWarrantyRegistry.sol", "VehicleWarrantyRegistry.json");
  let abi;
  if (fs.existsSync(abiPath)) {
    const artifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    abi = artifact.abi;
  } else {
    abi = [
      "function setGarage(address account, bool enabled)",
      "function isGarage(address account) view returns (bool)"
    ];
  }

  const contract = new ethers.Contract(cfg.WARRANTY_CONTRACT_ADDRESS, abi, ownerWallet);

  // Kiểm tra xem đã là garage chưa
  try {
    const isGarage = await contract.isGarage(garageAddress);
    if (isGarage) {
      console.log("✅ Wallet đã có quyền garage rồi!");
      return;
    }
  } catch (error) {
    console.log("⚠️  Không thể kiểm tra quyền garage (có thể do contract chưa có function này)");
  }

  // Set garage role
  try {
    console.log("\n🔄 Đang set garage role...");
    const tx = await contract.setGarage(garageAddress, true);
    console.log("📝 Transaction hash:", tx.hash);
    console.log("⏳ Đang chờ confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Success! Garage role đã được set");
    console.log("📦 Block number:", receipt.blockNumber);
    console.log("🔗 Transaction:", `https://sepolia.etherscan.io/tx/${receipt.hash}`);
  } catch (error) {
    console.error("❌ Error setting garage role:", error.message);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});


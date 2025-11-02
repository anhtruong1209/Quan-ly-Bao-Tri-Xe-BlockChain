const hre = require("hardhat");

/**
 * Script nhanh để set garage role cho wallet trong server config
 * Sử dụng hardhat để tránh vấn đề RPC timeout
 * 
 * Usage:
 * yarn hardhat run scripts/setGarageQuick.js --network sepolia
 */

async function main() {
  // Wallet cần set garage role (từ server config)
  const GARAGE_ADDRESS = "0xbB2c9c2beaeD565aC4dB0d51C4eED1DB35FDA0d0";
  
  // Contract address
  const CONTRACT_ADDRESS = "0x1e27Bfff869402332Ad4B35dAdb827C604A28ef0";

  console.log("📍 Contract Address:", CONTRACT_ADDRESS);
  console.log("🔧 Garage Address (will be set):", GARAGE_ADDRESS);

  const abi = [
    "function setGarage(address account, bool enabled)",
    "function isGarage(address account) view returns (bool)"
  ];

  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Signer Address:", signer.address);

  const registry = new hre.ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  // Kiểm tra xem đã là garage chưa
  try {
    const isGarage = await registry.isGarage(GARAGE_ADDRESS);
    if (isGarage) {
      console.log("✅ Wallet đã có quyền garage rồi!");
      return;
    }
  } catch (error) {
    console.log("⚠️  Không thể kiểm tra quyền garage:", error.message);
  }

  // Set garage role
  try {
    console.log("\n🔄 Đang set garage role...");
    const tx = await registry.setGarage(GARAGE_ADDRESS, true);
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


const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Đọc contract address từ file
  const deployFile = path.join(__dirname, "..", "deploy-addresses.txt");
  let contractAddress;
  
  try {
    const content = fs.readFileSync(deployFile, "utf8");
    const match = content.match(/VehicleWarrantyRegistry address: (0x[a-fA-F0-9]{40})/);
    if (match) {
      contractAddress = match[1];
    } else {
      throw new Error("Could not find contract address in deploy-addresses.txt");
    }
  } catch (error) {
    console.error("❌ Error reading deploy-addresses.txt:", error.message);
    console.log("💡 Please deploy the contract first or provide the contract address manually");
    process.exit(1);
  }

  console.log("📄 Contract address:", contractAddress);

  // Lấy địa chỉ admin từ command line hoặc sử dụng deployer
  const adminAddress = process.argv[2] || (await ethers.getSigners())[0].address;
  
  if (!ethers.isAddress(adminAddress)) {
    console.error("❌ Invalid address:", adminAddress);
    process.exit(1);
  }

  console.log("👤 Setting admin role for:", adminAddress);

  // Lấy contract instance
  const VehicleWarrantyRegistry = await ethers.getContractAt(
    "VehicleWarrantyRegistry",
    contractAddress
  );

  // Kiểm tra xem đã là admin chưa
  const isAlreadyAdmin = await VehicleWarrantyRegistry.isAdmin(adminAddress);
  if (isAlreadyAdmin) {
    console.log("ℹ️  Address is already an admin");
    return;
  }

  // Set admin role
  console.log("⏳ Setting admin role...");
  const tx = await VehicleWarrantyRegistry.setAdmin(adminAddress, true);
  console.log("📊 Transaction hash:", tx.hash);
  
  // Đợi transaction được confirm
  const receipt = await tx.wait();
  console.log("✅ Admin role set successfully!");
  console.log("📊 Block number:", receipt.blockNumber);
  console.log("⛽ Gas used:", receipt.gasUsed.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
  });


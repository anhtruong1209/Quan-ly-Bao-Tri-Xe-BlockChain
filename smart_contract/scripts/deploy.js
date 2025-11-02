const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment to Sepolia Testnet...\n");

  // Lấy account deploy
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);
  
  // Kiểm tra balance - tương thích với cả ethers v5 và v6
  const balance = await ethers.provider.getBalance(deployer.address);
  let balanceInEth;
  
  // Kiểm tra xem là ethers v5 hay v6
  if (ethers.utils && ethers.utils.formatEther) {
    // ethers v5
    balanceInEth = ethers.utils.formatEther(balance);
  } else if (typeof ethers.formatEther === 'function') {
    // ethers v6
    balanceInEth = ethers.formatEther(balance);
  } else {
    // Fallback: manual conversion
    const balanceStr = balance.toString();
    balanceInEth = (parseFloat(balanceStr) / 1e18).toFixed(4);
  }
  
  console.log("💰 Account balance:", balanceInEth, "ETH\n");

  const balanceNum = parseFloat(balanceInEth);
  if (balanceNum < 0.001) {
    console.warn("⚠️  Warning: Low balance! You may need more ETH for gas fees.\n");
  }

  // Deploy VehicleWarrantyRegistry
  console.log("📄 Deploying VehicleWarrantyRegistry...");
  const VehicleWarrantyRegistry = await ethers.getContractFactory("VehicleWarrantyRegistry");
  const registry = await VehicleWarrantyRegistry.deploy();
  
  // Đợi contract được deploy - tương thích với cả ethers v5 và v6
  let registryAddress;
  let deployTx;
  
  // Kiểm tra xem là ethers v5 hay v6
  if (typeof registry.waitForDeployment === 'function') {
    // ethers v6
    await registry.waitForDeployment();
    registryAddress = await registry.getAddress();
    deployTx = registry.deploymentTransaction();
  } else {
    // ethers v5
    await registry.deployed();
    registryAddress = registry.address;
    deployTx = registry.deployTransaction || registry.deploymentTransaction();
  }
  
  console.log("✅ VehicleWarrantyRegistry deployed to:", registryAddress);

  // Lấy transaction hash
  if (deployTx) {
    const receipt = await deployTx.wait();
    console.log("📊 Transaction hash:", receipt.hash);
    console.log("📊 Block number:", receipt.blockNumber);
    console.log("⛽ Gas used:", receipt.gasUsed.toString());
  }

  // Lưu address vào file
  const output =
    `VehicleWarrantyRegistry address: ${registryAddress}\n` +
    `Deployed by: ${deployer.address}\n` +
    `Network: Sepolia Testnet\n` +
    `Timestamp: ${new Date().toISOString()}\n`;
  
  const outPath = path.join(__dirname, "..", "deploy-addresses.txt");
  fs.writeFileSync(outPath, output, { encoding: "utf8" });
  
  console.log("\n✅ Contract address saved to deploy-addresses.txt");
  console.log("\n🔗 View on Etherscan:");
  console.log(`   https://sepolia.etherscan.io/address/${registryAddress}\n`);

  // Thông báo về owner
  const owner = await registry.owner();
  console.log("👤 Contract owner:", owner);
  console.log("📝 Note: Owner is automatically set as admin and user\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exitCode = 1;
  });

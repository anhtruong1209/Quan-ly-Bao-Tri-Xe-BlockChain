const hre = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const CarTransactionHistory = await ethers.getContractFactory("CarTransactionHistory");
  // Start deployment, returning a promise that resolves to a contract object
  const _CarTransactionHistory = await CarTransactionHistory.deploy();
  const Carmaintenance = await ethers.getContractFactory("Carmaintenance");
  // Start deployment, returning a promise that resolves to a contract object
  const _Carmaintenance = await Carmaintenance.deploy();
  const Caraccident = await ethers.getContractFactory("Caraccident");
  // Start deployment, returning a promise that resolves to a contract object
  const _Caraccident = await Caraccident.deploy();
  const VehicleWarrantyRegistry = await ethers.getContractFactory("VehicleWarrantyRegistry");
  const registry = await VehicleWarrantyRegistry.deploy();
  const output =
    "CarTransactionHistory address: " + _CarTransactionHistory.address + "\n" +
    "Carmaintenance address: " + _Carmaintenance.address + "\n" +
    "Caraccident address: " + _Caraccident.address + "\n" +
    "VehicleWarrantyRegistry address: " + registry.address + "\n";
  const outPath = path.join(__dirname, "..", "deploy-addresses.txt");
  fs.writeFileSync(outPath, output, { encoding: "utf8" });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// CarTransactionHistory address:0x8DD592A57B885E66b6bAB874751e2722285cb0AB
// Carmaintenance address:0xf6568AF39811345ab12301d6b929D7B3cC36c704
// Caraccident address:0xe0336F57A310C11d916e17b2868b18895766997e

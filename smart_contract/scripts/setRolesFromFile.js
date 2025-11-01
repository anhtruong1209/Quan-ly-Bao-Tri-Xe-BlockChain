const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const cfgPath = path.join(__dirname, "..", "roles.json");
  if (!fs.existsSync(cfgPath)) throw new Error("roles.json not found");
  const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const registryAddr = cfg.registry;
  if (!registryAddr) throw new Error("Missing registry address in roles.json");

  const abi = [
    "function setGarage(address account, bool enabled)",
    "function setManufacturer(address account, bool enabled)"
  ];

  const [signer] = await hre.ethers.getSigners();
  const registry = new hre.ethers.Contract(registryAddr, abi, signer);

  for (const g of cfg.garages || []) {
    const tx = await registry.setGarage(g, true);
    await tx.wait();
    console.log("Granted GARAGE:", g);
  }
  for (const m of cfg.manufacturers || []) {
    const tx = await registry.setManufacturer(m, true);
    await tx.wait();
    console.log("Granted MANUFACTURER:", m);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



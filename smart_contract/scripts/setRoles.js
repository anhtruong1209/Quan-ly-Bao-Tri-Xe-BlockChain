const { ethers } = require("hardhat");

// Usage:
// yarn hardhat run scripts/setRoles.js --network sepolia \
//   --contract 0xRegistryAddress \
//   --garage 0xGarageAddress \
//   --manufacturer 0xManufacturerAddress

async function main() {
  const args = process.argv.slice(2);
  function getFlag(name) {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : undefined;
  }

  const contractAddress = getFlag("contract");
  const garage = getFlag("garage");
  const manufacturer = getFlag("manufacturer");

  if (!contractAddress) throw new Error("--contract is required");
  const abi = [
    "function setGarage(address account, bool enabled)",
    "function setManufacturer(address account, bool enabled)"
  ];

  const [signer] = await ethers.getSigners();
  const registry = new ethers.Contract(contractAddress, abi, signer);

  if (garage) {
    const tx = await registry.setGarage(garage, true);
    await tx.wait();
    console.log("Garage role granted:", garage);
  }
  if (manufacturer) {
    const tx = await registry.setManufacturer(manufacturer, true);
    await tx.wait();
    console.log("Manufacturer role granted:", manufacturer);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



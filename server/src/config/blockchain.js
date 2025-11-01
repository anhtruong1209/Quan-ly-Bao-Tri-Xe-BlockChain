const fs = require("fs");
const path = require("path");

// Centralized blockchain config without .env
// You can edit these values directly.
const ETH_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/REg8LG5XyLCRieKeksDks";
const WALLET_PRIVATE_KEY = "0x85a675c6eb2fb511e0bf8b42b2b0941ce45526d6dfc125e07cd54a11b90ebd89";

// Try to auto-read the latest VehicleWarrantyRegistry address from smart_contract/deploy-addresses.txt
function readRegistryAddress() {
  try {
    const deployFile = path.join(__dirname, "../../..", "smart_contract", "deploy-addresses.txt");
    const text = fs.readFileSync(deployFile, "utf8");
    const line = text.split(/\r?\n/).find((l) => l.toLowerCase().includes("vehiclewarrantyregistry address"));
    if (!line) return null;
    const m = line.match(/0x[0-9a-fA-F]{40}/);
    return m ? m[0] : null;
  } catch (e) {
    return null;
  }
}

const WARRANTY_CONTRACT_ADDRESS = readRegistryAddress() || "0x26A5e5be297b0E6598a821fdf58467e9345De39d";

module.exports = {
  ETH_RPC_URL,
  WALLET_PRIVATE_KEY,
  WARRANTY_CONTRACT_ADDRESS,
};



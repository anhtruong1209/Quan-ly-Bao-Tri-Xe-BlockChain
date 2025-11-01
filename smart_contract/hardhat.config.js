require('dotenv').config();
require('@nomiclabs/hardhat-ethers')
// const { API_URL } = process.env;

module.exports = {
  solidity: "0.8.11",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/REg8LG5XyLCRieKeksDks",
      accounts: [`0x85a675c6eb2fb511e0bf8b42b2b0941ce45526d6dfc125e07cd54a11b90ebd89`],
    },
  },
};

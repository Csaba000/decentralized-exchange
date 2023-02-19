require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity:
  {
    compilers: [
      {
        version: "0.5.5",
      },
      {
        version: "0.6.7",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/" + "bnqXJ3kma1bUnhQmSTmGYzp96ch3kpVh",
      accounts: [
        process.env.PRIVATE_KEY,
      ],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API,
    }
  }
}

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const Factory = await hre.ethers.getContractFactory("DexFactory");
  const factory = await Factory.deploy('0x25514986159Da06857D740D73c796074661D2E3C');
  await factory.deployed();

  console.log("Factory deployed to:", factory.address);
  //log gasprice
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

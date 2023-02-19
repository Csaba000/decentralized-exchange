// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const Router = await hre.ethers.getContractFactory("DexRouter");
  const router = await Router.deploy('0xA16A20D39409112077d98c9Dc0b6f7ff93Cb059D',
  '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6');
  await router.deployed();

  console.log("Router deployed to:", router.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

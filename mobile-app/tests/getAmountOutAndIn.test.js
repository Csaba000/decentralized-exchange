import { ethers } from "ethers";
import abiRouter from "../contract/abiRouter.json";
import abiPool from "../contract/abiPool.json";

describe("getAmount functions", () => {
  let routerContract;
  let poolContract;

  const amountOut = 1;
  const calculatedAmountIn = "7179";

  const amountIn = 110000;
  const calculatedAmountOut = "15";

  const routerContractAddress = "0xE4c76722C7c5a60A62F6aF1Ec7C3C2E303c0dA4f";
  const poolContractAddress = "0x9D67D3969e45aDf9786F95A1F874C0E8d476630F";

  let reserves;
  let reserveIn;
  let reserveOut;

  beforeAll(async () => {
    const AlchemyProvider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/bnqXJ3kma1bUnhQmSTmGYzp96ch3kpVh"
    );

    routerContract = new ethers.Contract(
      routerContractAddress,
      abiRouter,
      AlchemyProvider
    );
    poolContract = new ethers.Contract(
      poolContractAddress,
      abiPool,
      AlchemyProvider
    );

    reserves = await poolContract.getReserves();
    reserveIn = reserves[0];
    reserveOut = reserves[1];
  });

  it("should return amountIn", async () => {
    const amountIn = await routerContract.getAmountIn(
      amountOut,
      reserveIn,
      reserveOut
    );

    expect(amountIn.toString()).toBe(calculatedAmountIn);
  });
  
  it("should return amountOut", async () => {
    const amountOut = await routerContract.getAmountOut(
      amountIn,
      reserveIn,
      reserveOut
    );

    expect(amountOut.toString()).toBe(calculatedAmountOut);
  });
});

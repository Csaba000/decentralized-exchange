import { ethers } from "ethers";
import abiFactory from "../contract/abiFactory.json";

describe("getPair function", () => {
  let contract;
  const tokenA = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const tokenB = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

  const result = "0x9D67D3969e45aDf9786F95A1F874C0E8d476630F";

  beforeAll(async () => {
    const AlchemyProvider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/bnqXJ3kma1bUnhQmSTmGYzp96ch3kpVh"
    );

    const contractAddress = "0xA16A20D39409112077d98c9Dc0b6f7ff93Cb059D";

    contract = new ethers.Contract(
      contractAddress,
      abiFactory,
      AlchemyProvider
    );
  });

  it("should return pool address", async () => {
    const poolAddress = await contract.getPair(tokenA, tokenB);

    expect(poolAddress).toEqual(result);
  });
});

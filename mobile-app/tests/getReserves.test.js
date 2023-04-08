import { ethers } from "ethers";
import abiPool from "../contract/abiPool.json";

describe("getReserves function", () => {
  let contract;
  const token1Reserve = "1014334013426672082"; // 1.014334013426672082
  const token2Reserve = "141733722072185"; // 0.000141733722072185

  beforeAll(async () => {
    const AlchemyProvider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/bnqXJ3kma1bUnhQmSTmGYzp96ch3kpVh"
    );

    const contractAddress = "0x9D67D3969e45aDf9786F95A1F874C0E8d476630F";

    contract = new ethers.Contract(contractAddress, abiPool, AlchemyProvider);
  });

  it("should return reserves", async () => {
    const reserves = await contract.getReserves();

    var reserve1 = reserves[0];
    var reserve2 = reserves[1];

    expect(reserve1.toString()).toEqual(token1Reserve);
    expect(reserve2.toString()).toEqual(token2Reserve);
  });
});

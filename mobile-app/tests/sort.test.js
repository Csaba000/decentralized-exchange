import { BigNumber } from "bignumber.js";

function sort(tokenA, tokenB) {
  var a = new BigNumber(tokenA.slice(2), 16);
  var b = new BigNumber(tokenB.slice(2), 16);
  if (a.lt(b)) {
    return [tokenA, tokenB, false];
  } else {
    return [tokenB, tokenA, true];
  }
}

describe("sort", () => {
  it("should sort tokens correctly", () => {
    const tokenA = "0x323";
    const tokenB = "0x556";
    const [firstToken, secondToken, isSecondTokenLarger] = sort(tokenA, tokenB);

    const a = new BigNumber(tokenA.slice(2), 16);
    const b = new BigNumber(tokenB.slice(2), 16);

    if (a.lt(b)) {
      expect(firstToken).toBe(tokenA);
      expect(secondToken).toBe(tokenB);
      expect(isSecondTokenLarger).toBe(false);
    } else {
      expect(firstToken).toBe(tokenB);
      expect(secondToken).toBe(tokenA);
      expect(isSecondTokenLarger).toBe(true);
    }
  });
});

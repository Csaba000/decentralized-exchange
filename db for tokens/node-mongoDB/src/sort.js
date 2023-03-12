import { BigNumber } from "bignumber.js";

export function sortTokens(tokenA, tokenB) {
  var a = new BigNumber(tokenA.toLowerCase().slice(2), 16);
  var b = new BigNumber(tokenB.toLowerCase().slice(2), 16);

  if (a.lt(b)) {
    return [tokenA, tokenB, false];
  } else {
    return [tokenB, tokenA, true];
  }
}

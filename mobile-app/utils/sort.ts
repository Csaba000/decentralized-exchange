import { BigNumber } from "bignumber.js";

export const sort = (tokenA: string, tokenB: string) => {
  var a = new BigNumber(tokenA.toLowerCase().slice(2), 16);
  var b = new BigNumber(tokenB.toLowerCase().slice(2), 16);

  if (a.lt(b)) {
    return false;
  } else {
    return true;
  }
};

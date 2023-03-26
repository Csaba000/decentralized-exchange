import { ethers } from "ethers";
import abiErc20 from "../../contract/abiErc20.json";

export const checkApprovalFrom = async (
  getTokenAddress: any,
  fromTokenIndex: any,
  getTokenDecimals: any,
  setFromApprove: any,
  alchemyProvider: any,
  accounts: any,
  routerAddress: any
) => {
  const fromTokenAddress = getTokenAddress(fromTokenIndex);
  console.log("fromTokenAddress", fromTokenAddress);
  

  const contractFrom = new ethers.Contract(
    fromTokenAddress,
    abiErc20,
    alchemyProvider
  );

  const allowanceFrom = await contractFrom.allowance(
    accounts[0]!,
    routerAddress
  );

  const allowanceInEthFrom = ethers.utils
    .formatUnits(allowanceFrom, getTokenDecimals(fromTokenIndex))
    .substring(0, 5);

  if (allowanceInEthFrom === "0.0") {
    setFromApprove(false);
  } else {
    setFromApprove(true);
  }
};

export const checkApprovalTo = async (
  getTokenAddress: any,
  toTokenIndex: any,
  getTokenDecimals: any,
  setToApprove: any,
  alchemyProvider: any,
  accounts: any,
  routerAddress: any
) => {
  const toTokenAddress = getTokenAddress(toTokenIndex);

  const contractTo = new ethers.Contract(
    toTokenAddress,
    abiErc20,
    alchemyProvider
  );

  const allowanceTo = await contractTo.allowance(accounts[0]!, routerAddress);

  const allowanceInEthTo = ethers.utils

    .formatUnits(allowanceTo, getTokenDecimals(toTokenIndex))
    .substring(0, 5);

  if (allowanceInEthTo === "0.0") {
    setToApprove(false);
  } else {
    setToApprove(true);
  }
};

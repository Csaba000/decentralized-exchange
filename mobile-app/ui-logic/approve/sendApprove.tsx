import { ethers } from "ethers";
import abiErc20 from "../../contract/abiErc20.json";

export const sendApprovalFrom = async (
  getTokenAddress: any,
  fromTokenIndex: any,
  alchemyProvider: any,
  accounts: any,
  routerAddress: any,
  connector: any,
  setTransactionTX: any
) => {
  const iERC20 = new ethers.utils.Interface(abiErc20);

  const approveAbi = iERC20.encodeFunctionData("approve", [
    routerAddress,
    ethers.constants.MaxUint256,
  ]);

  const nonce = await alchemyProvider.getTransactionCount(accounts[0]!);

  const tx = {
    from: accounts[0]!,
    to: getTokenAddress(fromTokenIndex),
    data: approveAbi,
    gasLimit: 1000000,
    nonce: nonce,
  };

  try {
    const send = connector.sendTransaction(tx);
    console.log("Transaction hash: ", await send);
    setTransactionTX(await send);
  } catch (error) {
    console.log(error);
  }
};

export const sendApprovalTo = async (
  getTokenAddress: any,
  toTokenIndex: any,
  alchemyProvider: any,
  accounts: any,
  routerAddress: any,
  connector: any,
  setTransactionTX: any
) => {
  const iERC20 = new ethers.utils.Interface(abiErc20);

  const nonce = await alchemyProvider.getTransactionCount(accounts[0]!);

  const approveAbi = iERC20.encodeFunctionData("approve", [
    routerAddress,
    ethers.constants.MaxUint256,
  ]);

  const tx = {
    from: accounts[0]!,
    to: getTokenAddress(toTokenIndex),
    data: approveAbi,
    gasLimit: 1000000,
    nonce: nonce,
  };

  try {
    const send = connector.sendTransaction(tx);
    console.log("Transaction hash: ", await send);
    setTransactionTX(await send);
  } catch (error) {
    console.log(error);
  }
};

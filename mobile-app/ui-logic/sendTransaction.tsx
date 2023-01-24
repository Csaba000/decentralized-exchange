import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";
import abiFactory from "../contract/abiFactory.json";

const useSendTransaction = () => {
  const { accounts } = useWalletConnect();
  const connector = useWalletConnect();

  const sendTransaction = async () => {
    const AlchemyProvider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/bnqXJ3kma1bUnhQmSTmGYzp96ch3kpVh"
    );

    const contractAddress = "0x23d6D5F080B6bBd171C8e99301be8BCDb85c874e";

    const contract = new ethers.Contract(contractAddress, abiFactory, AlchemyProvider);

    

    const iFeeToo = new ethers.utils.Interface(abiFactory);

    const encodedAbi = iFeeToo.encodeFunctionData("setFeeToSetter", [
      "0xc36ADD79C8B61Dc73f4E347A147750F752E84ccC",
    ]);

    const tx = {
      from: accounts[0],
      to: contractAddress,
      data: encodedAbi,
    };

    try {
      const send = connector.sendTransaction(tx);
      console.log(await send);
    } catch (error) {
      console.log(error);
    }
  };
  return { sendTransaction, accounts };
};

export default useSendTransaction;

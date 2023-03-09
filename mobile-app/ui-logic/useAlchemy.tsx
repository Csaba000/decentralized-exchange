import { JsonFragmentType } from "@ethersproject/abi";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useAlchemyProvider = () => {
  const [alchemyProvider, setAlchemyProvider] = useState<any>();
  const { accounts } = useWalletConnect();

  useEffect(() => {
    const init = async () => {
      const AlchemyProvider = new ethers.providers.JsonRpcProvider(
        "https://eth-goerli.g.alchemy.com/v2/bnqXJ3kma1bUnhQmSTmGYzp96ch3kpVh"
      );
      setAlchemyProvider(AlchemyProvider);
    };
    init();
  }, []);

  const getBalance = async () => {
    return await alchemyProvider.getBalance(accounts[0]!);
  };

  return { alchemyProvider, getBalance };
};

export default useAlchemyProvider;

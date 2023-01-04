import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";


const useConnectToMetamask = () => {
  const connector = useWalletConnect();
  const [connectedWallet, setConnectedWallet] = useState<boolean>(false);

  useEffect(() => {
    if (AsyncStorage.getItem("walletconnect") != null) {
      setConnectedWallet(true);
    }
  }, [AsyncStorage]);

  const connect = () => {
    try {
      connector.connect();
      setConnectedWallet(true);
    } catch (error) {
      console.log(error);
    }
  };

  return { connect, connectedWallet, setConnectedWallet };
};

export default useConnectToMetamask;
import "react-native-get-random-values";
import "@ethersproject/shims";
import "node-libs-react-native/globals.js";

import { useEffect, useState, useCallback } from "react";

import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

import WalletConnectProvider, {
  useWalletConnect,
} from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAsyncStorage } from "./AsyncStorage";
import { AbiItem } from "web3-utils";
import Web3 from "web3";
import abi from "./abi.json";

const HandleWalletConnect = () => {
  const { connected, accounts, chainId } = useWalletConnect();
  const [connectedWallet, setConnectedWallet] = useState<boolean>(false);
  const connector = useWalletConnect();

  useEffect(() => {
    (async () => {
      try {
        const AlchemyProvider = new Web3(
          "https://eth-goerli.g.alchemy.com/v2/bnqXJ3kma1bUnhQmSTmGYzp96ch3kpVh"
        );

        const block = await AlchemyProvider.eth.getBlockNumber();

      } catch (e: any) {
        console.log(e.message);
      }
    })();
  }, []);

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

  const sendTransaction = async () => {
    const AlchemyProvider = new Web3(
      "https://eth-goerli.g.alchemy.com/v2/bnqXJ3kma1bUnhQmSTmGYzp96ch3kpVh"
    );

    const contractAddress = "0x23d6D5F080B6bBd171C8e99301be8BCDb85c874e";

    const myContract = new AlchemyProvider.eth.Contract(
      abi as AbiItem[],
      contractAddress
    );

    const setFeeTo = myContract.methods.setFeeToSetter(
      "0x25514986159Da06857D740D73c796074661D2E3C"
    );

    const functionAbi = await setFeeTo.encodeABI();

    const txParams = {
      from: accounts[0],
      to: contractAddress,
      data: functionAbi,
    };

    try {
      const signer = await connector.sendTransaction(txParams);
      console.log("Transaction sent");
      console.log(signer);
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <View>
      <Button
        title={connectedWallet && connected ? "Connected" : "Connect to Wallet"}
        onPress={() => connect()}
      />
      <Button
        title="Disconnect"
        onPress={() => {
          AsyncStorage.clear();
          connector.killSession();
          setConnectedWallet(false);
        }}
      />
      <Button
        title="Send Transaction"
        onPress={() => {
          sendTransaction();
        }}
      />
    </View>
  );
};

export default function App() {
  return (
    <WalletConnectProvider
      redirectUrl={`wmw://app`}
      storageOptions={{
        asyncStorage: AsyncStorage as unknown as IAsyncStorage,
      }}
    >
      <View style={styles.container}>
        <HandleWalletConnect />
        <Text>Open up App.tsx to start working on your app!</Text>

        <StatusBar style="auto" />
      </View>
    </WalletConnectProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

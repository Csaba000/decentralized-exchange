import "react-native-get-random-values";
import "@ethersproject/shims";
import "node-libs-react-native/globals.js";

import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAsyncStorage } from "./AsyncStorage";
import BottomTab from "./components/BottomTab";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Header from "./components/Header";

export default function App() {
  return (
    <WalletConnectProvider
      redirectUrl={`wmw://app`}
      storageOptions={{
        asyncStorage: AsyncStorage as unknown as IAsyncStorage,
      }}
    >
      <NavigationContainer>
        <BottomTab />
        <StatusBar style="auto" />
      </NavigationContainer>
    </WalletConnectProvider>
  );
}

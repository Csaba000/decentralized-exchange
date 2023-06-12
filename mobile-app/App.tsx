import "react-native-get-random-values";
import "@ethersproject/shims";
import "node-libs-react-native/globals.js";

import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAsyncStorage } from "./AsyncStorage";
import BottomTab from "./components/BottomTab";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { ModalProvider } from "./context/ModalProvider";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Overwriting fontFamily style attribute preprocessor"]);
LogBox.ignoreLogs([
  `[Reanimated] Couldn't determine the version of the native part of Reanimated. Did you forget to re-build the app after upgrading react-native-reanimated? If you use Expo Go, you must use the exact version which is bundled into Expo SDK`,
]);
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <WalletConnectProvider
      redirectUrl={`wmw://app`}
      storageOptions={{
        asyncStorage: AsyncStorage as unknown as IAsyncStorage,
      }}
    >
      <ModalProvider>
        <NavigationContainer>
          <BottomTab />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ModalProvider>
    </WalletConnectProvider>
  );
}

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import useConnectToMetamask from "../ui-logic/connectWallet";
import * as Clipboard from "expo-clipboard";
import { notificationMessage } from "../utils/notifications";
import Icon from "react-native-vector-icons/Ionicons";
import useAlchemyProvider from "../ui-logic/useAlchemy";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Settings = () => {
  const { connect, connectedWallet, setConnectedWallet } =
    useConnectToMetamask();
  const { connected, accounts } = useWalletConnect();
  const connector = useWalletConnect();
  const { alchemyProvider, getBalance } = useAlchemyProvider();
  const [balance, setBalance] = useState<any>();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(accounts[0]);
  };

  useEffect(() => {
    const init = async () => {
      if (alchemyProvider != undefined && connected && connectedWallet) {
        const bal = await getBalance();
        const balInEth = ethers.utils.formatUnits(bal).substring(0, 5);
        setBalance(balInEth);
      }
    };
    init();
  }, [alchemyProvider, accounts]);

  if (alchemyProvider == undefined) {
    return (
      <View style={styles.centeredLoadingContainer}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#e3e2de",
          }}
        >
          Loading...
        </Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderImage}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../assets/Metamask-icon.png")}
            />
          </View>

          <Text style={styles.profileHeaderText}>Metamask</Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.profileBody}>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard();
                notificationMessage("Copied to clipboard", "#333", 2000);
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  alignItems: "center",
                }}
              >
                <Text style={styles.profileBodyText}>
                  Wallet Address:{" "}
                  <Icon name="md-copy-outline" size={20} color="#e3e2de" />
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#e3e2de",
                  fontWeight: "bold",
                }}
              >
                {" "}
                {connectedWallet && connected ? "\n" + accounts[0] : ""}
              </Text>
              {!connected && (
                <View
                  style={{
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Not Connected
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View
              style={{
                marginTop: 5,
                alignItems: "center",
              }}
            >
              <Text style={styles.profileBodyText}>Balance:</Text>
              {balance != undefined ? (
                <Text
                  style={{
                    bottom: 15,
                    fontSize: 18,
                    color: "#e3e2de",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {connectedWallet && connected ? "\n" + balance + " ETH" : " "}
                </Text>
              ) : (
                <ActivityIndicator size="small" color="#e3e2de" />
              )}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.connectedButtonContainer}>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => {
                if (connectedWallet && connected) {
                  notificationMessage("Already connected", "#333", 2000);
                } else {
                  connect();
                }
              }}
            >
              <Text style={styles.connectedText}>
                {connectedWallet && connected
                  ? "Connected"
                  : "Connect to Wallet"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={() => {
              AsyncStorage.clear();
              connector.killSession();
              setConnectedWallet(false);
            }}
          >
            <Text style={styles.connectedText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  profileContainer: {
    backgroundColor: "grey",
    width: "90%",
    height: "80%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  connectButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#444",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    width: "80%",
    height: 55,
    borderRadius: 50,
  },
  disconnectButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
    width: "80%",
    height: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderRadius: 50,
  },
  connectedText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  buttonContainer: {
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
    marginBottom: 20,
  },
  connectedButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  profileHeader: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "20%",
    backgroundColor: "grey",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  profileHeaderText: {
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  profileHeaderImage: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.7,
    shadowRadius: 16.0,
    elevation: 34,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "darkgrey",
  },
  profileBody: {
    alignItems: "center",

    width: "90%",
    height: "50%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    backgroundColor: "#555",
  },
  profileBodyText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});

export default Settings;

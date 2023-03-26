import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  Pressable,
  Switch,
  Image,
} from "react-native";
import { Picker, onOpen } from "react-native-actions-sheet-picker";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import Animated from "react-native-reanimated";
import useGetTokenData from "../ui-logic/useGetTokenData";
import { ethers } from "ethers";
import useAlchemyProvider from "../ui-logic/useAlchemy";
import abiErc20 from "../contract/abiErc20.json";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

const Liquidity = () => {
  const [liq, setLiq] = useState(false);
  const { data, getTokenNames } = useGetTokenData();

  const [fromTokenIndex, setFromTokenIndex] = useState(0);
  const [toTokenIndex, setToTokenIndex] = useState(0);

  const [firstSelectedToken, setFirstSelectedToken] = useState(false);
  const [secondSelectedToken, setSecondSelectedToken] = useState(false);

  const [fromTokenBalance, setFromTokenBalance] = useState("");
  const [toTokenBalance, setToTokenBalance] = useState("");

  const { connected, accounts } = useWalletConnect();

  const { alchemyProvider, getBalance } = useAlchemyProvider();

  const tokenNames = getTokenNames().map((token: any) => token.symbol);
  const tokenAddresses = getTokenNames().map((token: any) => token.address);
  const tokenIds = getTokenNames().map((token: any) => token.id);
  const tokenDecimals = getTokenNames().map((token: any) => token.decimals);

  const getTokenAddress = (tokenId: number) => {
    return tokenAddresses[tokenIds.indexOf(tokenId)];
  };

  const getTokenDecimals = (tokenId: number) => {
    return tokenDecimals[tokenIds.indexOf(tokenId)];
  };

  const getTokenBalance = async (tokenId: number, from: boolean) => {
    const tokenAddress = getTokenAddress(tokenId);

    if (tokenAddress === "") {
      const balInEth = ethers.utils
        .formatUnits(await getBalance())
        .substring(0, 5);
      from ? setFromTokenBalance(balInEth) : setToTokenBalance(balInEth);
      return;
    }

    const contractAddress = tokenAddress;

    const contract = new ethers.Contract(
      contractAddress,
      abiErc20,
      alchemyProvider
    );

    const balanceOf = await contract.balanceOf(accounts[0]!);

    const balance = parseFloat(
      ethers.utils.formatUnits(balanceOf, getTokenDecimals(tokenId))
    ).toFixed(2);

    from ? setFromTokenBalance(balance) : setToTokenBalance(balance);
  };

  return (
    <View style={styles.container}>
      <Switch value={liq} onValueChange={() => setLiq(!liq)} />
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Liquidity</Text>
        </View>
        {liq ? (
          <View style={styles.textInputs}>
            <View style={styles.fromInput}>
              <SelectDropdown
                onChangeSearchInputText={() => {}}
                rowTextStyle={styles.dropdownRowText}
                disableAutoScroll={true}
                defaultButtonText={"Select Token"}
                buttonStyle={styles.dropdownButtonHalf}
                buttonTextStyle={styles.dropdownButtonText}
                data={tokenNames}
                onSelect={async (selectedItem, index) => {
                  setFromTokenIndex(index);
                  setFirstSelectedToken(true);
                  await getTokenBalance(index, true);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                dropdownStyle={styles.dropdownStyle}
                renderDropdownIcon={() => {
                  return (
                    <Icon
                      name="chevron-down-outline"
                      size={24}
                      color="black"
                      style={{ marginLeft: 10 }}
                    />
                  );
                }}
              />

              <Text style={styles.fromToText}>From</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                placeholderTextColor="grey"
              />
            </View>
            <View style={styles.fromInput}>
              <SelectDropdown
                rowTextStyle={styles.dropdownRowText}
                dropdownStyle={styles.dropdownStyle}
                disableAutoScroll={true}
                defaultButtonText="WETH"
                buttonStyle={styles.dropdownButtonHalf}
                buttonTextStyle={styles.dropdownButtonText}
                data={[
                  "ETH",
                  "BTC",
                  "USDT",
                  "BNB",
                  "ADA",
                  "XRP",
                  "DOGE",
                  "DOT",
                ]}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                searchInputStyle={styles.dropdownSearchInput}
                renderDropdownIcon={() => {
                  return (
                    <Icon
                      name="chevron-down-outline"
                      size={24}
                      color="black"
                      style={{ marginLeft: 10 }}
                    />
                  );
                }}
              />
              <Text style={styles.fromToText}>To</Text>
              <TextInput
                onChangeText={(text) => {
                  console.log(text);
                }}
                style={styles.textInput}
                placeholder="0.00"
                placeholderTextColor="grey"
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Image
              style={{ width: 100, height: 100, marginBottom: 20 }}
              source={require("../assets/liqWhite.png")}
            ></Image>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Add Liquidity to earn fees
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={() => {
            setLiq(true);
          }}
        >
          <Text style={styles.connectedText}>Add Liquidity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Liquidity;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
  textInputs: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    fontSize: 18,
    width: "80%",
    height: 55,
    backgroundColor: "white",
    borderRadius: 50,
    marginBottom: 20,
    paddingLeft: 20,
  },
  cardContainer: {
    borderRadius: 20,
    height: 600,
    backgroundColor: "#333",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  disconnectButton: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
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
    color: "black",
    fontSize: 20,
  },
  fromInput: {
    left: "10%",
    width: "100%",
  },
  fromToText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
  },
  dropdownButton: {
    marginTop: 20,
    width: "100%",
    borderRadius: 5,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownButtonText: {
    color: "black",
    textAlign: "center",
  },
  dropdownSearchInput: {
    borderWidth: 1,
    borderColor: "gray",
    height: 40,
  },
  selectContainer: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonHalf: {
    fontSize: 1,
    width: 120,
    borderRadius: 30,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownRowText: {
    fontSize: 18,
    color: "white",
    textAlignVertical: "center",
  },
  dropdownStyle: {
    backgroundColor: "#999",
    width: 200,
    height: 300,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "gray",
  },
});

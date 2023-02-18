import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import useAlchemyProvider from "../ui-logic/useAlchemy";
import useGetTokenData from "../ui-logic/useGetTokenData";
import abiErc20 from "../contract/abiErc20.json";
import abiPool from "../contract/abiPool.json";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import useInitAll from "../ui-logic/useGetPairAddress";
import LoadingIndicator from "../components/LoadingIndicator";
import { BigNumber } from "bignumber.js";
import useRouterContract from "../ui-logic/useRouterContract";

const Swap = () => {
  const { data, getTokenNames } = useGetTokenData();
  const { alchemyProvider, getBalance } = useAlchemyProvider();
  const {
    data2,
    poolContract,
    routerContract,
    getPairAddress,
    getRouterAddress,
  } = useInitAll();
  const { accounts } = useWalletConnect();
  // const { routerContract } = useRouterContract();

  const [fromTokenBalance, setFromTokenBalance] = useState("");

  const [fromTokenIndex, setFromTokenIndex] = useState(0);
  const [toTokenIndex, setToTokenIndex] = useState(0);

  const [toTokenBalance, setToTokenBalance] = useState("");

  const [poolAddress, setPoolAddress] = useState("");
  //first inputField => true, second inputField => false
  const [inputState, setInputState] = useState(false);

  const [secondText, setSecondText] = useState("");
  const [firstText, setFirstText] = useState("");

  const [getAmountOut, setAmountOut] = useState(0);
  const [getAmountIn, setAmountIn] = useState(0);

  useEffect(() => {
    if (data) {
      getPairAddress(
        data![fromTokenIndex].address,
        data![toTokenIndex].address
      );
      getRouterAddress();
    }
  }, [toTokenIndex, fromTokenIndex]);

  function sort(tokenA: string, tokenB: string): [string, string, boolean] {
    var a = new BigNumber(tokenA.slice(2), 16);
    var b = new BigNumber(tokenB.slice(2), 16);
    if (a.lt(b)) {
      return [tokenA, tokenB, false];
    } else {
      return [tokenB, tokenA, true];
    }
  }

  const calculateSecondInput = async (text: string) => {
    const amounts = await poolContract.getReserves();

    var reserve1: BigNumber = amounts[0];
    var reserve2: BigNumber = amounts[1];

    const tokenIn = getTokenAddress(fromTokenIndex);
    const tokenOut = getTokenAddress(toTokenIndex);

    var token1,
      token2,
      swapped = sort(tokenIn, tokenOut);

    try {
      if (swapped) {
        const amountOut = await routerContract.getAmountOut(
          text,
          reserve2,
          reserve1
        );

        setAmountOut(amountOut);
      } else {
        setAmountOut(
          await routerContract.getAmountOut(text, reserve1, reserve2)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateFirstInput = async (text: string) => {
    const amounts = await poolContract.getReserves();

    var reserve1: BigNumber = amounts[0];
    var reserve2: BigNumber = amounts[1];

    const tokenIn = getTokenAddress(toTokenIndex);
    const tokenOut = getTokenAddress(fromTokenIndex);

    var token1,
      token2,
      swapped = sort(tokenIn, tokenOut);

    try {
      if (swapped) {
        const amountIn = await routerContract.getAmountIn(
          text,
          reserve2,
          reserve1
        );

        setAmountIn(amountIn);
      } else {
        setAmountIn(await routerContract.getAmountIn(text, reserve1, reserve2));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // MEGY MINDEN GG WP, KELL SWAP MEG LIQUIDITY PROVIDE
  const tokenNames = getTokenNames().map((token: any) => token.symbol);
  const tokenAddresses = getTokenNames().map((token: any) => token.address);
  const tokenIds = getTokenNames().map((token: any) => token.id);
  const tokenDecimals = getTokenNames().map((token: any) => token.decimals);

  const getTokenAddress = (tokenId: number) => {
    return tokenAddresses[tokenIds.indexOf(tokenId)];
  };

  //TODO - get decimals from token and format accordingly
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
    const balInEth = ethers.utils
      .parseUnits(balanceOf.toString(), 10)
      .toString();

    from ? setFromTokenBalance(balInEth) : setToTokenBalance(balInEth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Swap</Text>
        </View>
        <View style={styles.textInputs}>
          <View style={styles.fromInput}>
            <SelectDropdown
              onChangeSearchInputText={(text) => {
                console.log(text);
              }}
              rowTextStyle={styles.dropdownRowText}
              disableAutoScroll={true}
              defaultButtonText={"Select Token"}
              buttonStyle={styles.dropdownButtonHalf}
              buttonTextStyle={styles.dropdownButtonText}
              data={tokenNames}
              onSelect={async (selectedItem, index) => {
                setFromTokenIndex(index);
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
            <Text style={{ fontSize: 14, color: "white" }}>
              Balance: {fromTokenBalance}
            </Text>

            <TextInput
              value={!inputState ? getAmountIn.toString() : firstText}
              onChangeText={async (text) => {
                setInputState(true);
                setFirstText(text);
                await calculateSecondInput(text);
              }}
              style={styles.textInput}
              placeholder="0.00"
              placeholderTextColor="grey"
            />
          </View>

          <View style={styles.fromInput}>
            <View
              style={{
                marginTop: 10,
              }}
            >
              <SelectDropdown
                onChangeSearchInputText={(text) => {
                  console.log(text);
                }}
                rowTextStyle={styles.dropdownRowText}
                dropdownStyle={styles.dropdownStyle}
                disableAutoScroll={true}
                defaultButtonText={"Select Token"}
                buttonStyle={styles.dropdownButtonHalf}
                buttonTextStyle={styles.dropdownButtonText}
                data={tokenNames}
                onSelect={async (selectedItem, index) => {
                  setToTokenIndex(index);
                  await getTokenBalance(index, false);
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
            </View>
            <Text style={styles.fromToText}>To</Text>
            <Text style={{ fontSize: 16, color: "white" }}>
              Balance: {toTokenBalance}
            </Text>
            <TextInput
              value={inputState ? getAmountOut.toString() : secondText}
              onChangeText={async (text) => {
                setInputState(false);
                setSecondText(text);
                await calculateFirstInput(text);
              }}
              style={styles.textInput}
              placeholder="0.00"
              placeholderTextColor="grey"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={() => {
            alert("Hello");
          }}
        >
          <Text style={styles.connectedText}>Swap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Swap;

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

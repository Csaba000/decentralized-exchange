import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Linking,
  ScrollView,
  RefreshControl,
  Switch,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import useAlchemyProvider from "../ui-logic/useAlchemy";
import useGetTokenData from "../ui-logic/useGetTokenData";
import abiErc20 from "../contract/abiErc20.json";
import abiRouter from "../contract/abiRouter.json";
import abiPool from "../contract/abiPool.json";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import useInitAll from "../ui-logic/useGetPairAddress";
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator";
import { BigNumber } from "bignumber.js";
import useRouterContract from "../ui-logic/useRouterContract";
import useConnectToMetamask from "../ui-logic/connectWallet";
import { notificationMessage } from "../utils/notifications";
import { useNavigation } from "@react-navigation/native";
import useDebounce from "../ui-logic/useDebounce";
import { Skeleton } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import MyModal from "../components/Modal";

import { ModalContext } from "../context/ModalProvider";
import { loadPartialConfig } from "@babel/core";
import { sort } from "../utils/sort";
import CustomButton from "../components/Button/CustomButton";
import {
  checkApprovalFrom,
  checkApprovalTo,
} from "../ui-logic/approve/checkApprove";

import {
  sendApprovalFrom,
  sendApprovalTo,
} from "../ui-logic/approve/sendApprove";

const Swap = () => {
  const navigation = useNavigation<any>();
  const { data, getTokenNames } = useGetTokenData();
  const { alchemyProvider, getBalance } = useAlchemyProvider();
  const {
    data2,
    poolContract,
    routerContract,
    getPairAddress,
    getRouterAddress,
  } = useInitAll();
  const { connected, accounts } = useWalletConnect();
  const { connect, connectedWallet } = useConnectToMetamask();

  const WETHAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
  // const { routerContract } = useRouterContract();

  const [fromTokenBalance, setFromTokenBalance] = useState("");

  const [refreshing, setRefreshing] = React.useState(false);

  const [liq, setLiq] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    if (fromTokenIndex !== 0) checkApprovalFrom();
    if (toTokenIndex !== 0) checkApprovalTo();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const [fromTokenIndex, setFromTokenIndex] = useState(0);
  const [toTokenIndex, setToTokenIndex] = useState(0);

  const [firstSelectedToken, setFirstSelectedToken] = useState(false);
  const [secondSelectedToken, setSecondSelectedToken] = useState(false);

  const [toTokenBalance, setToTokenBalance] = useState("");

  const connector = useWalletConnect();

  const [poolAddress, setPoolAddress] = useState("");
  //first inputField => true, second inputField => false
  const [inputState, setInputState] = useState(false);

  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(false);

  const [secondText, setSecondText] = useState("");
  const [firstText, setFirstText] = useState("");

  const debouncedValueFirst = useDebounce<string>(firstText, 500);
  const debouncedValueSecond = useDebounce<string>(secondText, 500);

  const [getAmountOut, setAmountOut] = useState("");
  const [getAmountIn, setAmountIn] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const routerAddress = "0xE4c76722C7c5a60A62F6aF1Ec7C3C2E303c0dA4f";

  const { slippage, deadline } = useContext(ModalContext);
  const [stateSlippage, setStateSlippage] = slippage;
  const [stateDeadline, setStateDeadline] = deadline;

  const [fromApprove, setFromApprove] = useState(false);
  const [toApprove, setToApprove] = useState(false);

  const [transactionTX, setTransactionTX] = useState("");

  useEffect(() => {
    if (data) {
      getPairAddress(
        data![fromTokenIndex].address,
        data![toTokenIndex].address
      );
      getRouterAddress();
    }
  }, [toTokenIndex, fromTokenIndex]);

  useEffect(() => {
    const inti = async () => {
      await calculateSecondInput(firstText);
    };
    inti();
  }, [debouncedValueFirst]);

  useEffect(() => {
    const inti = async () => {
      await calculateFirstInput(secondText);
    };
    inti();
  }, [debouncedValueSecond]);

  const calculateSecondInput = async (text: string) => {
    if (text === "") {
      setSecondText("");
      return;
    }

    if (!poolContract) {
      alert("There is no pool for this pair! Please try another pair.");
      console.log("There is no pool for this pair! Please try another pair.");

      return;
    }
    setLoadingSecond(true);

    const amounts = await poolContract.getReserves();

    var reserve1: BigNumber = amounts[0];
    var reserve2: BigNumber = amounts[1];

    const tokenIn = getTokenAddress(fromTokenIndex);
    const tokenOut = getTokenAddress(toTokenIndex);

    var swapped = sort(tokenIn, tokenOut);

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
    } finally {
      setLoadingSecond(false);
    }
  };

  const calculateFirstInput = async (text: string) => {
    if (text === "") {
      setFirstText("");
      return;
    }

    if (!poolContract) {
      alert("There is no pool for this pair! Please try another pair.");
      return;
    }

    setLoadingFirst(true);
    const amounts = await poolContract.getReserves();

    var reserve1: BigNumber = amounts[0];
    var reserve2: BigNumber = amounts[1];

    const tokenIn = getTokenAddress(fromTokenIndex);
    const tokenOut = getTokenAddress(toTokenIndex);

    var swapped = sort(tokenIn, tokenOut);

    try {
      if (swapped) {
        const amountIn = await routerContract.getAmountIn(
          text,
          reserve2,
          reserve1
        );

        setAmountIn(amountIn);

        return amountIn;
      } else {
        const amountIn = await routerContract.getAmountIn(
          text,
          reserve1,
          reserve2
        );
        setAmountIn(amountIn);

        return amountIn;
      }
    } catch (error) {
      console.log(error);
      return "0";
    } finally {
      setLoadingFirst(false);
    }
  };

  const tokenNames = getTokenNames().map((token: any) => token.symbol);
  const tokenAddresses = getTokenNames().map((token: any) => token.address);
  const tokenIds = getTokenNames().map((token: any) => token.id);
  const tokenDecimals = getTokenNames().map((token: any) => token.decimals);

  const getTokenAddress = (tokenId: number) => {
    return tokenAddresses[tokenIds.indexOf(tokenId)];
  };

  const getTokenName = (tokenId: number) => {
    return tokenNames[tokenIds.indexOf(tokenId)];
  }

  const getTokenDecimals = (tokenId: number) => {
    return tokenDecimals[tokenIds.indexOf(tokenId)];
  };

  const getTokenBalance = async (tokenId: number, from: boolean) => {
    const tokenAddress = getTokenAddress(tokenId);
    const tokenName = getTokenName(tokenId)
    
    if (tokenName === "ETH") {
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

  //7 swap
  const swapETHForExactTokens = async () => {
    const iRouter = new ethers.utils.Interface(abiRouter);

    const deadline = Math.floor(Date.now() / 1000) + 60 * Number(stateDeadline);

    const swapABI = iRouter.encodeFunctionData("swapETHForExactTokens", [
      secondText,
      [WETHAddress, getTokenAddress(toTokenIndex)],
      accounts[0]!,
      deadline,
    ]);

    const tx = {
      from: accounts[0]!,
      to: routerAddress,
      data: swapABI,
      gasLimit: 1000000,
      nonce: await alchemyProvider.getTransactionCount(accounts[0]!),
      value: Number(getAmountIn),
    };

    try {
      const send = connector.sendTransaction(tx);
      console.log("Transaction hash: ", await send);
      setTransactionTX(await send);
      getTokenBalance(fromTokenIndex, true);
      getTokenBalance(toTokenIndex, false);
    } catch (error) {
      console.log(error);
    }
  };

  //10 swap
  const swapExactTokensForTokens = async () => {
    const iRouter = new ethers.utils.Interface(abiRouter);

    const deadline = Math.floor(Date.now() / 1000) + 60 * Number(stateDeadline);

    const slippage = parseInt(stateSlippage) / 100;

    //6 db fuggveny swaphoz, min value szamolas mindig a beirt mezovel ellentetes mezobol kell kiszamolni
    const minValue = parseInt(getAmountOut) * slippage;

    const remainingAmount = parseInt(getAmountOut) - minValue;

    const swapABI = iRouter.encodeFunctionData("swapExactTokensForTokens", [
      firstText,
      Math.round(remainingAmount),
      [getTokenAddress(fromTokenIndex), getTokenAddress(toTokenIndex)],
      accounts[0]!,
      deadline,
    ]);

    const tx = {
      from: accounts[0]!,
      to: routerAddress,
      data: swapABI,
      gasLimit: 1000000,
      nonce: await alchemyProvider.getTransactionCount(accounts[0]!),
    };

    try {
      const send = connector.sendTransaction(tx);
      console.log("Transaction hash: ", await send);
      setTransactionTX(await send);
      getTokenBalance(fromTokenIndex, true);
      getTokenBalance(toTokenIndex, false);
    } catch (error) {
      console.log(error);
    }
  };

  //12 swap
  const swapTokensForExactTokens = async () => {
    const iRouter = new ethers.utils.Interface(abiRouter);

    const deadline = Math.floor(Date.now() / 1000) + 60 * Number(stateDeadline);

    const slippage = parseInt(stateSlippage) / 100;

    const slippageValue = parseInt(getAmountIn) * slippage;

    const maxValue = parseInt(getAmountIn) + slippageValue;

    const swapABI = iRouter.encodeFunctionData("swapTokensForExactTokens", [
      secondText,
      Math.round(maxValue),
      [getTokenAddress(fromTokenIndex), getTokenAddress(toTokenIndex)],
      accounts[0]!,
      deadline,
    ]);
    const tx = {
      from: accounts[0]!,
      to: routerAddress,
      data: swapABI,
      gasLimit: 1000000,
      nonce: await alchemyProvider.getTransactionCount(accounts[0]!),
    };

    try {
      const send = connector.sendTransaction(tx);
      console.log("Transaction hash: ", await send);
      setTransactionTX(await send);
      getTokenBalance(fromTokenIndex, true);
      getTokenBalance(toTokenIndex, false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkApprovalFrom = async () => {
    const fromTokenAddress = getTokenAddress(fromTokenIndex);

    const contractFrom = new ethers.Contract(
      fromTokenAddress,
      abiErc20,
      alchemyProvider
    );

    const allowanceFrom = await contractFrom.allowance(
      accounts[0]!,
      routerAddress
    );

    const allowanceInEthFrom = ethers.utils
      .formatUnits(allowanceFrom, getTokenDecimals(fromTokenIndex))
      .substring(0, 5);

    if (allowanceInEthFrom === "0.0") {
      setFromApprove(false);
    } else {
      setFromApprove(true);
    }
  };

  const checkApprovalTo = async () => {
    const toTokenAddress = getTokenAddress(toTokenIndex);

    const contractTo = new ethers.Contract(
      toTokenAddress,
      abiErc20,
      alchemyProvider
    );

    const allowanceTo = await contractTo.allowance(accounts[0]!, routerAddress);

    const allowanceInEthTo = ethers.utils
      .formatUnits(allowanceTo, getTokenDecimals(toTokenIndex))
      .substring(0, 5);

    if (allowanceInEthTo === "0.0") {
      setToApprove(false);
    } else {
      setToApprove(true);
    }
  };

  const addLiquidity = async () => {
    const iRouter = new ethers.utils.Interface(abiRouter);

    const minLiq = 1010;

    const deadline = Math.floor(Date.now() / 1000) + 60 * Number(stateDeadline);
    let addLiqAbi = "";

    console.log(Number(firstText) * minLiq);

    if (inputState) {
      addLiqAbi = iRouter.encodeFunctionData("addLiquidity", [
        getTokenAddress(fromTokenIndex),
        getTokenAddress(toTokenIndex),
        firstText,
        parseInt(getAmountOut),
        0,
        0,
        accounts[0]!,
        deadline,
      ]);
    } else {
      addLiqAbi = iRouter.encodeFunctionData("addLiquidity", [
        getTokenAddress(fromTokenIndex),
        getTokenAddress(toTokenIndex),
        parseInt(getAmountIn),
        secondText,
        0,
        0,
        accounts[0]!,
        deadline,
      ]);
    }

    const tx = {
      from: accounts[0]!,
      to: routerAddress,
      data: addLiqAbi,
      gasLimit: 1000000,
      nonce: await alchemyProvider.getTransactionCount(accounts[0]!),
    };

    try {
      const send = connector.sendTransaction(tx);
      console.log("Transaction hash: ", await send);
      setTransactionTX(await send);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fromTokenIndex !== 0) checkApprovalFrom();
    if (toTokenIndex !== 0) checkApprovalTo();
  }, [fromTokenIndex, toTokenIndex, fromApprove, toApprove]);

  return (
    <>
      <View style={[styles.container]}>
        <View style={styles.liqContainer}>
          <Text style={styles.addLiq}>Add liqudity</Text>
          <Switch
            value={liq}
            onValueChange={() => setLiq(!liq)}
            style={{
              transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
            }}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.cardContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {liq ? "Add liquidity" : "Swap"}
              </Text>
            </View>
            {connected ? (
              <View style={styles.textInputs}>
                <View style={styles.fromInput}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "80%",
                    }}
                  >
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
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      style={{
                        marginTop: 8,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Icon
                        name="settings"
                        size={24}
                        color="white"
                        style={{ marginLeft: 10 }}
                      />
                    </TouchableOpacity>
                    <MyModal
                      modalVisible={modalVisible}
                      setModalVisible={setModalVisible}
                    />
                  </View>
                  <View style={styles.balanceAndText}>
                    <Text style={styles.fromToText}>From</Text>
                    <Text style={styles.balanceText}>
                      Balance:{" "}
                      {!fromTokenBalance ? (
                        <LoadingIndicator size={10} color="white" />
                      ) : (
                        fromTokenBalance
                      )}
                    </Text>
                  </View>
                  {!loadingFirst ? (
                    <TextInput
                      keyboardType="numeric"
                      editable={firstSelectedToken}
                      value={!inputState ? getAmountIn.toString() : firstText}
                      onChangeText={async (text) => {
                        setInputState(true);
                        if (text.length > 0) {
                          setFirstText(text);
                        } else {
                          setFirstText("");
                          setAmountOut("");
                        }
                      }}
                      style={styles.textInput}
                      placeholder={firstSelectedToken ? "0.0" : "Select Token"}
                      placeholderTextColor="grey"
                    />
                  ) : (
                    <>
                      <View style={[styles.textInput]}>
                        <LoadingIndicator size={20} color="black" />
                      </View>
                    </>
                  )}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      Value:{" "}
                      {new BigNumber(firstText)
                        .dividedBy(
                          new BigNumber(10 ** getTokenDecimals(fromTokenIndex))
                        )
                        .toString()}{" "}
                    </Text>
                  </View>
                </View>

                <View style={styles.fromInput}>
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <SelectDropdown
                      onChangeSearchInputText={() => {}}
                      rowTextStyle={styles.dropdownRowText}
                      dropdownStyle={styles.dropdownStyle}
                      disableAutoScroll={true}
                      defaultButtonText={"Select Token"}
                      buttonStyle={styles.dropdownButtonHalf}
                      buttonTextStyle={styles.dropdownButtonText}
                      data={tokenNames}
                      onSelect={async (selectedItem, index) => {
                        setToTokenIndex(index);
                        setSecondSelectedToken(true);
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
                  <View style={styles.balanceAndText}>
                    <Text style={styles.fromToText}>To</Text>
                    <Text style={styles.balanceText}>
                      Balance:{" "}
                      {!toTokenBalance ? (
                        <LoadingIndicator size={10} color="white" />
                      ) : (
                        toTokenBalance
                      )}
                    </Text>
                  </View>
                  {!loadingSecond ? (
                    <TextInput
                      keyboardType="numeric"
                      editable={secondSelectedToken}
                      value={inputState ? getAmountOut.toString() : secondText}
                      onChangeText={async (text) => {
                        setInputState(false);
                        // const bigText = new BigNumber(text);
                        // const bigTen = new BigNumber(10);
                        // const bigTenPow = bigTen.pow(
                        //   getTokenDecimals(fromTokenIndex)
                        // );
                        // const result = bigText.multipliedBy(bigTenPow);

                        if (text.length > 0) {
                          setSecondText(text);
                        } else {
                          setSecondText("");
                          setAmountIn("");
                        }
                      }}
                      style={styles.textInput}
                      placeholder={secondSelectedToken ? "0.0" : "Select Token"}
                      placeholderTextColor="grey"
                    />
                  ) : (
                    <>
                      <View style={[styles.textInput]}>
                        <LoadingIndicator size={20} color="black" />
                      </View>
                    </>
                  )}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      Value:{" "}
                      {new BigNumber(secondText)
                        .dividedBy(
                          new BigNumber(10 ** getTokenDecimals(toTokenIndex))
                        )
                        .toString()}{" "}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                PLEASE CONNECT WALLET FIRST
              </Text>
            )}
            {connected ? (
              <>
                {transactionTX.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        "https://goerli.etherscan.io/tx/" + transactionTX
                      );
                    }}
                  >
                    <Text style={styles.txStyle}>Latest Transaction:</Text>
                    <Text style={styles.txStyle}>
                      {transactionTX.length > 0
                        ? transactionTX.substring(0, 10) +
                          "..." +
                          transactionTX.substring(transactionTX.length - 10)
                        : ""}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
                {(fromTokenIndex !== null || toTokenIndex !== null) &&
                (tokenNames[fromTokenIndex] === "ETH" ||
                  tokenNames[toTokenIndex] === "ETH" ||
                  (fromApprove && toApprove)) ? (
                  liq ? (
                    <CustomButton
                      title="Add liquidity"
                      onPress={() => {
                        if (firstText || secondText) {
                          addLiquidity();
                        } else {
                          alert("Please enter amount to add liquidity");
                        }
                      }}
                      style={{ marginTop: 20 }}
                    />
                  ) : (
                    <CustomButton
                      title="Swap"
                      onPress={async () => {
                        if (firstText || secondText) {
                          if (inputState) {
                            swapExactTokensForTokens();
                          } else {
                            if (tokenNames[fromTokenIndex] === "ETH") {
                              swapETHForExactTokens();
                            } else {
                              swapTokensForExactTokens();
                            }
                          }
                        } else {
                          alert("Please enter amount to swap");
                        }
                      }}
                      style={{ marginTop: 20 }}
                    />
                  )
                ) : (
                  <>
                    {fromTokenIndex !== null && !fromApprove && (
                      <CustomButton
                        title={"Approve" + " " + tokenNames[fromTokenIndex]}
                        onPress={() => {
                          sendApprovalFrom(
                            getTokenAddress,
                            fromTokenIndex,
                            alchemyProvider,
                            accounts,
                            routerAddress,
                            connector,
                            setTransactionTX
                          );
                        }}
                        style={{ marginTop: 20 }}
                      />
                    )}
                    {toTokenIndex !== null && !toApprove && (
                      <CustomButton
                        title={"Approve" + " " + tokenNames[toTokenIndex]}
                        onPress={() => {
                          sendApprovalTo(
                            getTokenAddress,
                            toTokenIndex,
                            alchemyProvider,
                            accounts,
                            routerAddress,
                            connector,
                            setTransactionTX
                          );
                        }}
                        style={{ marginTop: 20 }}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => {
                  navigation.navigate("Settings");
                }}
              >
                <Text style={styles.connectedTextButton}>
                  {connectedWallet && connected
                    ? "Connected"
                    : "Go to Settings"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Swap;

const styles = StyleSheet.create({
  liqContainer: {
    backgroundColor: "#444",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
  },
  addLiq: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  txStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    position: "absolute",
    top: 20,
  },
  scroll: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  connectButton: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#666",
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
  balanceAndText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },
  balanceText: {
    fontSize: 12,
    color: "white",
    opacity: 0.7,
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
    width: "100%",
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
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 20,
  },
  cardContainer: {
    borderRadius: 20,
    height: 600,
    backgroundColor: "#333",
    width: "90%",
    padding: 20,
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
  connectedTextButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
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

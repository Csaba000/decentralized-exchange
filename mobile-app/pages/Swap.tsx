import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView,
  RefreshControl,
  Switch,
  ActivityIndicator,
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
import Animated, { JumpingTransition } from "react-native-reanimated";
import MyModal from "../components/Modal";

import { ModalContext } from "../context/ModalProvider";

import { sort } from "../utils/sort";
import CustomButton from "../components/Button/CustomButton";
import Slider from "@react-native-community/slider";

import {
  sendApprovalFrom,
  sendApprovalTo,
} from "../ui-logic/approve/sendApprove";

import Modal from "react-native-modal";

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

  const [poolAddress, setPoolAddress] = useState(data2);
  //first inputField => true, second inputField => false
  const [inputState, setInputState] = useState(false);

  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(false);

  const [secondText, setSecondText] = useState("");
  const [firstText, setFirstText] = useState("");

  const debouncedValueFirst = useDebounce<string>(firstText, 500);
  const debouncedValueSecond = useDebounce<string>(secondText, 500);

  const [loadingBalanceToken0, setLoadingBalanceToken0] = useState(false);
  const [loadingBalanceToken1, setLoadingBalanceToken1] = useState(false);

  const debounceTokenBalance0 = useDebounce(loadingBalanceToken0, 500);
  const debounceTokenBalance1 = useDebounce(loadingBalanceToken1, 500);

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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [poolBalance, setPoolBalance] = useState(0);

  const [sliderValue, setSliderValue] = useState(0);

  const [poolAllowance, setPoolAllowance] = useState(false);

  const [token0BalanceInPool, setToken0BalanceInPool] = useState("");
  const [token1BalanceInPool, setToken1BalanceInPool] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (poolContract) {
      const getAllowance = async () => {
        const allowance = await poolContract.allowance(
          accounts[0]!,
          routerAddress
        );
      };

      let allowanceInEthTo = "";

      getAllowance().then(async (res) => {
        const allowance = await poolContract.allowance(
          accounts[0]!,
          routerAddress
        );

        allowanceInEthTo = ethers.utils
          .formatUnits(allowance, getTokenDecimals(toTokenIndex))
          .substring(0, 5);

        if (allowanceInEthTo === "0.0") {
          setPoolAllowance(false);
        } else {
          setPoolAllowance(true);
        }
      });
    }
  }, [poolContract]);

  useEffect(() => {
    if (data) {
      const poolAdd = getPairAddress(
        data![fromTokenIndex].address,
        data![toTokenIndex].address
      );

      setPoolAddress(poolAdd);
      getRouterAddress();
    }
  }, [data, toTokenIndex, fromTokenIndex]);

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

    if (!poolContract && !liq) {
      alert("There is no pool for this pair! Please try another pair.");
      console.log("There is no pool for this pair! Please try another pair.");

      return;
    } else if ((liq && poolContract) || (poolContract && !liq)) {
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
    } else {
      return;
    }
  };

  const calculateFirstInput = async (text: string) => {
    if (text === "") {
      setFirstText("");
      return;
    }

    if (!poolContract && !liq) {
      alert("There is no pool for this pair! Please try another pair.");
      return;
    } else if ((liq && poolContract) || (poolContract && !liq)) {
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
    } else {
      return;
    }
  };

  const tokenNames = getTokenNames().map((token: any) => token.symbol);
  const tokenAddresses = getTokenNames().map((token: any) => token.address);
  const tokenIds = getTokenNames().map((token: any) => token.id);
  const tokenDecimals = getTokenNames().map((token: any) => token.decimals);

  const getTokenAddress = (tokenId: number): string => {
    return tokenAddresses[tokenIds.indexOf(tokenId)];
  };

  const getTokenName = (tokenId: number) => {
    return tokenNames[tokenIds.indexOf(tokenId)];
  };

  const getTokenDecimals = (tokenId: number) => {
    return tokenDecimals[tokenIds.indexOf(tokenId)];
  };

  const getTokenBalance = async (tokenId: number, from: boolean) => {
    const tokenAddress = getTokenAddress(tokenId);
    const tokenName = getTokenName(tokenId);

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

  //8 swap
  const swapExactETHForTokens = async () => {
    const iRouter = new ethers.utils.Interface(abiRouter);

    const deadline = Math.floor(Date.now() / 1000) + 60 * Number(stateDeadline);

    const slippage = parseInt(stateSlippage) / 100;

    const minValue = parseInt(getAmountOut) * slippage;

    const remainingAmount = parseInt(getAmountOut) - minValue;

    const swapABI = iRouter.encodeFunctionData("swapExactETHForTokens", [
      Math.round(remainingAmount).toString(),
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
      value: Number(firstText),
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

  //9 swap
  const swapExactTokensForETH = async () => {
    const iRouter = new ethers.utils.Interface(abiRouter);

    const deadline = Math.floor(Date.now() / 1000) + 60 * Number(stateDeadline);

    const slippage = parseInt(stateSlippage) / 100;

    const minValue = parseInt(getAmountOut) * slippage;

    const remainingAmount = parseInt(getAmountOut) - minValue;

    const swapABI = iRouter.encodeFunctionData("swapExactTokensForETH", [
      firstText,
      Math.round(remainingAmount).toString(),
      [getTokenAddress(fromTokenIndex), WETHAddress],
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
      Math.round(remainingAmount).toString(),
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

  //11 swap
  const swapTokensForExactETH = async () => {
    const iRouter = new ethers.utils.Interface(abiRouter);

    const deadline = Math.floor(Date.now() / 1000) + 60 * Number(stateDeadline);

    const slippage = parseInt(stateSlippage) / 100;

    const slippageValue = parseInt(getAmountIn) * slippage;

    const maxValue = parseInt(getAmountIn) + slippageValue;

    const swapABI = iRouter.encodeFunctionData("swapTokensForExactETH", [
      secondText,
      Math.round(maxValue).toString(),
      [getTokenAddress(fromTokenIndex), WETHAddress],
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
      Math.round(maxValue).toString(),
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

  //TODO - automatic insert to db when add liquidity

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

    if (inputState) {
      addLiqAbi = iRouter.encodeFunctionData("addLiquidity", [
        getTokenAddress(fromTokenIndex),
        getTokenAddress(toTokenIndex),
        firstText,
        !poolContract ? secondText : getAmountOut,
        1,
        1,
        accounts[0]!,
        deadline,
      ]);
    } else {
      addLiqAbi = iRouter.encodeFunctionData("addLiquidity", [
        getTokenAddress(fromTokenIndex),
        getTokenAddress(toTokenIndex),
        !poolContract ? firstText : getAmountIn,
        secondText,
        1,
        1,
        accounts[0]!,
        deadline,
      ]);
    }

    const tx = {
      from: accounts[0]!,
      to: routerAddress,
      data: addLiqAbi,
      gasLimit: 2_000_000,
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

  const getPoolTokenBalance = async () => {
    const balance = await poolContract.balanceOf(accounts[0]!);
    const poolDecimals = await poolContract.decimals();

    if (balance > 0) {
      setPoolBalance(balance / 10 ** poolDecimals);
    } else {
      setPoolBalance(0);
    }
  };

  useEffect(() => {
    if (!poolAddress) {
      setPoolBalance(0);
    }
    if (poolContract) {
      getPoolTokenBalance();
    }
  }, [poolContract, fromTokenIndex, toTokenIndex]);

  useEffect(() => {
    if (fromTokenIndex !== 0) checkApprovalFrom();
    if (toTokenIndex !== 0) checkApprovalTo();
  }, [fromTokenIndex, toTokenIndex, fromApprove, toApprove]);

  const checkIfError = () => {
    if (liq) {
      if (firstText !== "" && poolContract) {
        if (Number(firstText) < 1100 || Number(getAmountOut) < 1100) {
          return true;
        }
      }

      if (secondText !== "" && poolContract) {
        if (Number(secondText) < 1100 || Number(getAmountIn) < 1100) {
          return true;
        }
      }
    }
    return false;
  };

  const removeLiquidity = async () => {
    const poolDecimals = await poolContract.decimals();

    const allowance = await poolContract.allowance(accounts[0]!, routerAddress);

    const allowanceInEthTo = ethers.utils
      .formatUnits(allowance, getTokenDecimals(toTokenIndex))
      .substring(0, 5);

    if (allowanceInEthTo === "0.0") {
      setPoolAllowance(false);
      return;
    }

    const tenInBigNumber = new BigNumber(10);
    const poolBalanceInBigNumber = new BigNumber(poolBalance);

    const poolDecimalInBigNumber = tenInBigNumber.pow(poolDecimals);

    const poolBigNumberResult = poolDecimalInBigNumber.multipliedBy(
      poolBalanceInBigNumber
    );

    const result = poolBigNumberResult.multipliedBy(sliderValue / 100);
    const resultFixed = result.toFixed(0);

    const iRouter = new ethers.utils.Interface(abiRouter);

    const deadline = Math.floor(Date.now() / 1000) + 60 * Number(stateDeadline);
    let removeLiqAbi = "";

    const swapped = sort(
      getTokenAddress(fromTokenIndex),
      getTokenAddress(toTokenIndex)
    );

    if (swapped) {
      removeLiqAbi = iRouter.encodeFunctionData("removeLiquidity", [
        getTokenAddress(toTokenIndex),
        getTokenAddress(fromTokenIndex),
        resultFixed,
        1,
        1,
        accounts[0]!,
        deadline,
      ]);
    } else {
      removeLiqAbi = iRouter.encodeFunctionData("removeLiquidity", [
        getTokenAddress(fromTokenIndex),
        getTokenAddress(toTokenIndex),
        resultFixed,
        1,
        1,
        accounts[0]!,
        deadline,
      ]);
    }

    const tx = {
      from: accounts[0]!,
      to: routerAddress,
      data: removeLiqAbi,
      gasLimit: 2_000_000,
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

  const approvePool = async () => {
    const iRouter = new ethers.utils.Interface(abiErc20);

    const approveABI = iRouter.encodeFunctionData("approve", [
      routerAddress,
      ethers.constants.MaxUint256,
    ]);

    const tx = {
      from: accounts[0]!,
      to: data2,
      data: approveABI,
      gasLimit: 200_0000,
      nonce: await alchemyProvider.getTransactionCount(accounts[0]!),
    };

    try {
      const send = connector.sendTransaction(tx);
      console.log("Transaction hash: ", await send);
      setTransactionTX(await send);
      setPoolAllowance(true);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTokenBalances = async () => {
    setLoadingBalanceToken0(true);
    setLoadingBalanceToken1(true);
    const poolDecimals = await poolContract.decimals();
    const token0Address = getTokenAddress(fromTokenIndex);
    const token1Address = getTokenAddress(toTokenIndex);

    const contractToken0 = new ethers.Contract(
      token0Address,
      abiErc20,
      alchemyProvider
    );

    const contractToken1 = new ethers.Contract(
      token1Address,
      abiErc20,
      alchemyProvider
    );

    const tenInBigNumber = new BigNumber(10);
    const poolBalanceInBigNumber = new BigNumber(poolBalance);

    const poolDecimalInBigNumber = tenInBigNumber.pow(poolDecimals);

    const poolBigNumberResult = poolDecimalInBigNumber.multipliedBy(
      poolBalanceInBigNumber
    );

    const result = poolBigNumberResult.multipliedBy(sliderValue / 100);
    const resultFixed = result.toFixed(0);

    const token0Balance = await contractToken0.balanceOf(data2);
    const token1Balance = await contractToken1.balanceOf(data2);

    const token0BalanceInBigNumber = new BigNumber(token0Balance.toString());
    const token1BalanceInBigNumber = new BigNumber(token1Balance.toString());

    const totalSupply = await poolContract.totalSupply();

    const totalSupplyInBigNumber = new BigNumber(totalSupply.toString());

    const resultFixedInBigNumber = new BigNumber(resultFixed, 10);

    const amount0 = resultFixedInBigNumber
      .multipliedBy(token0BalanceInBigNumber)
      .dividedBy(totalSupplyInBigNumber);

    const amount1 = resultFixedInBigNumber
      .multipliedBy(token1BalanceInBigNumber)
      .dividedBy(totalSupplyInBigNumber);

    const token0Decimal = getTokenDecimals(fromTokenIndex);
    const token1Decimal = getTokenDecimals(toTokenIndex);

    const tenInBigNumberToken0 = new BigNumber(10);
    const tenInBigNumberToken1 = new BigNumber(10);

    setToken0BalanceInPool(
      amount0.dividedBy(tenInBigNumberToken0.pow(token0Decimal)).toFixed(5)
    );
    setToken1BalanceInPool(
      amount1.dividedBy(tenInBigNumberToken1.pow(token1Decimal)).toFixed(5)
    );

    setLoadingBalanceToken0(false);
    setLoadingBalanceToken1(false);
  };

  useEffect(() => {
    if (data2 && firstSelectedToken && secondSelectedToken && isModalVisible) {
      calculateTokenBalances();
    }
  }, [
    data2,
    firstSelectedToken,
    secondSelectedToken,
    sliderValue,
    isModalVisible,
  ]);

  return (
    <>
      <View style={[styles.container]}>
        <View style={styles.liqContainer}>
          <Modal
            onBackdropPress={() => setIsModalVisible(false)}
            onBackButtonPress={() => setIsModalVisible(false)}
            isVisible={isModalVisible}
            swipeDirection="down"
            onSwipeComplete={toggleModal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={300}
            animationOutTiming={300}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={300}
            style={styles.modal}
          >
            <View style={styles.modalContent}>
              <View style={{ alignItems: "center" }}>
                <View style={styles.barIcon} />
                {poolBalance > 0 &&
                firstSelectedToken &&
                secondSelectedToken ? (
                  <>
                    <View style={styles.top}>
                      <Text style={styles.tokenName}>
                        {getTokenName(fromTokenIndex)}
                      </Text>
                      {debounceTokenBalance0 ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={{ fontWeight: "bold" }}>
                          {" "}
                          {token0BalanceInPool}
                        </Text>
                      )}
                    </View>
                    <View style={styles.bottom}>
                      <Text style={styles.tokenName}>
                        {getTokenName(toTokenIndex)}
                      </Text>
                      {debounceTokenBalance1 ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <Text style={{ fontWeight: "bold" }}>
                            {token1BalanceInPool}
                          </Text>
                        </>
                      )}
                    </View>
                    <Text style={[styles.tokenName, { fontSize: 16 }]}>
                      LP balance: {poolBalance.toFixed(6)}
                    </Text>
                    <Text>Value: {sliderValue.toFixed(0)}%</Text>
                  </>
                ) : (
                  <View
                    style={{
                      position: "absolute",
                      top: 200,
                    }}
                  >
                    <Text style={styles.tokenName}>
                      You don't have any pools for this token pair
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    position: "absolute",
                    top: 200,
                  }}
                >
                  <View
                    style={{
                      width: 300,
                    }}
                  >
                    {poolBalance > 0 &&
                    firstSelectedToken &&
                    secondSelectedToken ? (
                      <Slider
                        onValueChange={setSliderValue}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#000000"
                      />
                    ) : null}
                  </View>
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: 330,
                  }}
                >
                  {!poolAllowance && !!data2 && (
                    <CustomButton
                      title="Approve pool"
                      onPress={() => {
                        approvePool();
                        toggleModal();
                      }}
                    />
                  )}
                  <CustomButton
                    disabled={
                      toTokenIndex === fromTokenIndex ? true : !poolAllowance
                    }
                    title={
                      toTokenIndex && fromTokenIndex !== null
                      ? toTokenIndex === fromTokenIndex
                        ? "Same coin selected!"
                        : "Remove liquidity"
                      : "Select tokens"
                    }
                    onPress={() => {
                      getPoolTokenBalance();
                      removeLiquidity();
                      toggleModal();
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
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
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <Text style={styles.headerText}>
                  {liq ? "Add liquidity" : "Swap"}
                </Text>
                {liq ? (
                  <TouchableOpacity
                    onPress={() => toggleModal()}
                    style={{
                      backgroundColor: "#807e7e",
                      borderRadius: 6,
                      width: 100,
                      height: 35,
                      marginTop: 5,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Remove liquidity
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
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
                      Balance: {!fromTokenBalance ? "—" : fromTokenBalance}
                    </Text>
                  </View>
                  {!loadingFirst ? (
                    <TextInput
                      keyboardType="numeric"
                      editable={firstSelectedToken}
                      value={
                        ((liq && poolContract) || (poolContract && !liq)) &&
                        !inputState
                          ? getAmountIn.toString()
                          : firstText
                      }
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
                      {firstText || getAmountIn
                        ? new BigNumber(
                            inputState ? Number(firstText) : Number(getAmountIn)
                          )
                            .dividedBy(
                              new BigNumber(
                                10 ** getTokenDecimals(fromTokenIndex) ||
                                  10 ** 18
                              )
                            )
                            .toString()
                        : "—"}
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
                      Balance: {!toTokenBalance ? "—" : toTokenBalance}
                    </Text>
                  </View>
                  {!loadingSecond ? (
                    <TextInput
                      keyboardType="numeric"
                      editable={secondSelectedToken}
                      value={
                        ((liq && poolContract) || (poolContract && !liq)) &&
                        inputState
                          ? getAmountOut.toString()
                          : secondText
                      }
                      onChangeText={async (text) => {
                        setInputState(false);
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
                      {secondText || getAmountOut
                        ? new BigNumber(
                            Number(!inputState ? secondText : getAmountOut)
                          )
                            .dividedBy(
                              new BigNumber(
                                10 ** getTokenDecimals(toTokenIndex) || 10 ** 18
                              )
                            )
                            .toString()
                        : "—"}
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
                {checkIfError() ? (
                  <Text style={styles.txStyle}>
                    Error: Insufficient liquidity (MIN: 1100)
                  </Text>
                ) : (
                  <></>
                )}
                {transactionTX.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        "https://goerli.etherscan.io/tx/" + transactionTX
                      );
                    }}
                    style={{
                      marginTop: 30,
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
                      disabled={
                        toTokenIndex && fromTokenIndex !== null
                          ? toTokenIndex === fromTokenIndex
                            ? true
                            : checkIfError()
                          : true
                      }
                      title={
                        toTokenIndex && fromTokenIndex !== null
                        ? toTokenIndex === fromTokenIndex
                          ? "Same coin selected!"
                          : "Add Liquidity"
                        : "Select tokens"
                      }
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
                      title={
                        toTokenIndex && fromTokenIndex !== null
                          ? toTokenIndex === fromTokenIndex
                            ? "Same coin selected!"
                            : "Swap"
                          : "Select tokens"
                      }
                      disabled={
                        toTokenIndex && fromTokenIndex !== null
                          ? toTokenIndex === fromTokenIndex
                            ? true
                            : false
                          : true
                      }
                      onPress={async () => {
                        if (firstText || secondText) {
                          if (inputState) {
                            if (tokenNames[fromTokenIndex] == "ETH") {
                              swapExactETHForTokens();
                            }
                            if (tokenNames[toTokenIndex] == "ETH") {
                              swapExactTokensForETH();
                            }
                            if (
                              tokenNames[fromTokenIndex] != "ETH" &&
                              tokenNames[toTokenIndex] != "ETH"
                            ) {
                              swapExactTokensForTokens();
                            }
                          } else {
                            if (tokenNames[fromTokenIndex] == "ETH") {
                              swapETHForExactTokens();
                            }
                            if (tokenNames[toTokenIndex] == "ETH") {
                              swapTokensForExactETH();
                            }
                            if (
                              tokenNames[fromTokenIndex] != "ETH" &&
                              tokenNames[toTokenIndex] != "ETH"
                            ) {
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
  tokenName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  top: {
    width: 350,
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
    marginTop: 20,
    backgroundColor: "#d3d3d3",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottom: {
    width: 350,
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
    backgroundColor: "#d3d3d3",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexView: {
    flex: 1,
    backgroundColor: "white",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 500,
    paddingBottom: 20,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
  },
  text: {
    color: "#020202",
    fontSize: 24,
    marginTop: 100,
  },
  btnContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 500,
  },
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
    fontSize: 28,
    marginRight: 20,
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

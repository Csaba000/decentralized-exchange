import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import abiPool from "../contract/abiPool.json";
import useAlchemyProvider from "./useAlchemy";
import abiRouter from "../contract/abiRouter.json";

const useInitAll = () => {
  const [data2, setData] = useState<any>();
  const [poolContract, setPoolContract] = useState<any>();
  const [routerContract, setRouterContract] = useState<any>();
  const { alchemyProvider } = useAlchemyProvider();

  const routerAddress = "0xE4c76722C7c5a60A62F6aF1Ec7C3C2E303c0dA4f";

  const getRouterAddress = () => {
    setRouterContract(
      new ethers.Contract(routerAddress, abiRouter, alchemyProvider)
    );
  };

  const getPairAddress = (token0: string, token1: string) => {
    axios
      .post("http://192.168.224.180:3000/poolAddress", {
        params: {
          token_addr1: token0,
          token_addr2: token1,
        },
      })
      .then(function (response) {
        setPoolContract(
          new ethers.Contract(response.data, abiPool, alchemyProvider)
        );
        setData(response.data);
        return response.data;
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  return {
    data2,
    poolContract,
    routerContract,
    getPairAddress,
    getRouterAddress,
  };
};
export default useInitAll;

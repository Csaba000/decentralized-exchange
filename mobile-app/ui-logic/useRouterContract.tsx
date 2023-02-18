import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import abiRouter from "../contract/abiRouter.json";
import useAlchemyProvider from "./useAlchemy";

const useRouterContract = () => {
  const [routerContract, setRouterContract] = useState<Contract>();
  const { alchemyProvider } = useAlchemyProvider();

  const routerAddress = "0xE4c76722C7c5a60A62F6aF1Ec7C3C2E303c0dA4f";

  useEffect(() => {
    const contract = new ethers.Contract(
      routerAddress,
      abiRouter,
      alchemyProvider
    );
    setRouterContract(contract);
  }, []);

  return {
    routerContract,
  };
};

export default useRouterContract;

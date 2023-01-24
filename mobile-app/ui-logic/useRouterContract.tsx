import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import abiRouter from "../contract/abiRouter.json";
import useAlchemyProvider from "./useAlchemy";

const useRouterContract = () => {
  const [routerContract, setRouterContract] = useState<Contract>();
  const { alchemyProvider } = useAlchemyProvider();

  const routerAddress = "0xBf15E7891aa8BDE426032810811cC39990e75452";

  useEffect(() => {
    const init = async () => {
      const contract = new ethers.Contract(
        routerAddress,
        abiRouter,
        alchemyProvider
      );

      setRouterContract(contract);
    };
    init();
  }, []);

  return {
    routerContract,
  };
};

export default useRouterContract;

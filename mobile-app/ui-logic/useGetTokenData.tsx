import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "../utils/constants";

type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

const useGetTokenData = () => {
  const [data, setData] = useState<Token[]>();
  const [errors, setErrors] = useState<any>(null);
  let tokens: any = [];

  useEffect(() => {
    axios
      .get(`${URL}/tokenInfo`)
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.log("ERROR", error);
        setErrors(error);
      });
  }, []);

  const getTokenNames = () => {
    if (!data) return [];

    for (let i = 0; i < data!.length; i++) {
      tokens.push({
        id: i,
        symbol: data![i].symbol,
        address: data![i].address,
        decimals: data![i].decimals,
      });
    }
    return tokens;
  };

  return { data,errors, getTokenNames };
};

export default useGetTokenData;

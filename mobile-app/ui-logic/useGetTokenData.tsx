import axios from "axios";
import { useEffect, useState } from "react";

type Token = {
  name: string;
  symbol: string;
  address: string;
};

const useGetTokenData = () => {
  const [data, setData] = useState<Token[]>();
  let tokens: any = [];

  useEffect(() => {
    axios
      .get("http://192.168.1.180:3000/tokenInfo")
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  }, []);

  const getTokenNames = () => {
    for (let i = 0; i < data!.length; i++) {
      tokens.push({
        id: i,
        symbol: data![i].symbol,
        address: data![i].address,
      });
    }
    return tokens;
  };

  

  return { data, getTokenNames };
};

export default useGetTokenData;

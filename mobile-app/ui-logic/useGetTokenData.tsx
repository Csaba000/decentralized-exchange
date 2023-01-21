import axios from "axios";
import { useEffect, useState } from "react";

type Token = {
  name: string;
  symbol: string;
  address: string;
};

const useGetTokenData = () => {
  const [data, setData] = useState<Token[]>();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    axios
      .get("https://potent-standing-cloak.glitch.me/tokenInfo")
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  }, []);

  const getTokenNames = () => {
    let tokenNames = [];
    for (let i = 0; i < data!.length; i++) {
      tokenNames.push(data![i].symbol.toUpperCase());
    }
    return tokenNames;
  };

  return { data, tokens, getTokenNames };
};

export default useGetTokenData;

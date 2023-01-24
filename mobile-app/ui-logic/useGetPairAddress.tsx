import axios from "axios";
import { useState } from "react";

const useGetPairAddress = () => {
  const [data2, setData] = useState<any>();

  const getPairAddress = (token0: string, token1: string) => {
    axios
      .get("http://192.168.1.180:3000/poolAddress", {
        params: {
          token_addr1: token0,
          token_addr2: token1,
        },
      })
      .then(function (response) {
        setData(response.data);
        return response.data;
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  return { data2, getPairAddress };
};
export default useGetPairAddress;

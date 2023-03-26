import axios from "axios";
import { useEffect, useState } from "react";
import { API_KEY } from "../utils/constants";

const useCoinsApi = () => {
  const [coins, setCoins] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      )
      .then((response) => {
        setCoins(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  }, []);

  return { coins, loading, error };
};

export default useCoinsApi;

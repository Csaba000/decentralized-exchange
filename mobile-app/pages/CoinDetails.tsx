import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const CoinDetails = () => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const route = useRoute<any>();
  const { id } = route.params;

  useEffect(() => {
    setLoading(true);
    const get = async () => {
      await axios
        .get(`https://api.coingecko.com/api/v3/coins/${id}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    get();
    setLoading(false);
  }, [id]);

  if (loading || !data) {
    return (
      <View style={styles.flex}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }



  function filterText(text: string) {
    var linkRegex = /<a\b[^>]*>(.*?)<\/a>/gi;
    text = text.replace(linkRegex, "");
    text = text.replace(/\r|\n|\u003ca/g, "");
    return text;
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.coinInfoBox}>
        <View style={styles.coinInfoBoxHeader}>
          <Image
            source={{
              uri: data.image.large,
            }}
            style={{ width: 40, height: 40 }}
          />
          <Text style={styles.coinTitle}>{data.name}</Text>

          <Text style={styles.coinSymbol}>{data.symbol.toUpperCase()}</Text>
        </View>

        <View style={styles.flexDirectionRow}>
          <Text style={styles.coinPrice}>
            {"$" +
              data.tickers[0].converted_last.usd
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          </Text>
          <Icon
            name={
              data.market_data.price_change_percentage_24h > 0
                ? "caret-up"
                : "caret-down"
            }
            size={20}
            color={
              data.market_data.price_change_percentage_24h > 0
                ? "#76b628"
                : "#E15241"
            }
            style={{ alignSelf: "center" }}
          />

          <Text
            style={[
              styles.coinPriceChange,
              {
                color:
                  data.market_data.price_change_percentage_24h > 0
                    ? "#76b628"
                    : "#E15241",
              },
            ]}
          >
            {data.market_data.price_change_percentage_24h.toFixed(2) + "%"}
          </Text>

          <Text style={styles.coinConvertedPrice}>
            {data.tickers[0].converted_last.btc &&
              data.tickers[0].converted_last.btc.toFixed(6) + " BTC" + "\n"}
            {data.tickers[0].converted_last.eth &&
              data.tickers[0].converted_last.eth.toFixed(6) + " ETH"}
          </Text>
        </View>

        <View style={styles.coinInfoValues}>
          <View style={styles.flexDirectionSpaceBetween}>
            <Text style={styles.coinInfoOneValueTitle}>Market Cap</Text>
            <Text style={styles.coinInfoOneValue}>
              {"$" +
                data.market_data.market_cap.usd
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
          </View>
          <View style={styles.flexDirectionSpaceBetween}>
            <Text style={styles.coinInfoOneValueTitle}>
              24 Hour Trading Vol
            </Text>
            <Text style={styles.coinInfoOneValue}>
              {"$" +
                data.tickers[0].converted_volume.usd
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
          </View>
          <View style={styles.flexDirectionSpaceBetween}>
            <Text style={styles.coinInfoOneValueTitle}>
              Fully Diluted Valuation
            </Text>
            {(data.market_data.fully_diluted_valuation.usd && (
              <Text style={styles.coinInfoOneValue}>
                {"$" +
                  data.market_data.fully_diluted_valuation.usd
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            )) || <Text style={styles.coinInfoOneValue}>Not Available</Text>}
          </View>
          <View style={styles.flexDirectionSpaceBetween}>
            <Text style={styles.coinInfoOneValueTitle}>Circulating Supply</Text>
            <Text style={styles.coinInfoOneValue}>
              {data.market_data.circulating_supply}
            </Text>
          </View>
          <View style={styles.flexDirectionSpaceBetween}>
            <Text style={styles.coinInfoOneValueTitle}>Total Supply</Text>
            <Text style={styles.coinInfoOneValue}>
              {data.market_data.total_supply}
            </Text>
          </View>
          <View style={styles.flexDirectionSpaceBetween}>
            <Text style={styles.coinInfoOneValueTitle}>Max Supply</Text>
            <Text style={styles.coinInfoOneValue}>
              {data.market_data.max_supply ? data.market_data.max_supply : "∞"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.coinDescriptionBox}>
        <Text style={styles.coinDescriptionTitle}>Description</Text>
        <Text style={styles.coinDescriptionText}>
          {data.description.en
            ? filterText(data.description.en)
            : "No description found"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flexDirectionRow: {
    flexDirection: "row",
  },
  flexDirectionSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coinInfoBox: {
    backgroundColor: "#d8eaf5",
    width: "95%",
    borderRadius: 10,
    alignSelf: "center",
    height: 370,
  },
  coinTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
    textAlignVertical: "center",
  },
  marginContainer: {
    marginLeft: 55,
  },
  coinSymbol: {
    color: "#777",
    fontWeight: "bold",
    marginLeft: 15,
    alignSelf: "center",
    textAlignVertical: "center",
  },
  coinInfoBoxHeader: {
    flexDirection: "row",
    margin: 15,
  },
  coinPrice: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
  },
  coinPriceChange: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#black",
    marginLeft: 2,
    alignSelf: "center",
  },
  coinConvertedPrice: {
    fontSize: 12,
    color: "#333",
    marginLeft: 15,
    marginTop: 5,
    fontWeight: "500",
  },
  coinInfoValues: {
    marginTop: 15,
    height: 230,
    borderRadius: 10,
    marginHorizontal: 15,
    backgroundColor: "#a2b8c5",
  },
  coinInfoOneValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
    marginTop: 15,
  },
  coinInfoOneValueTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginLeft: 15,
    marginTop: 15,
  },
  coinDescriptionBox: {
    flex: 1,
    marginBottom: 15,
  },
  coinDescriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
    marginTop: 15,
  },
  coinDescriptionText: {
    fontSize: 14,
    color: "#333",
    marginHorizontal: 15,
    marginTop: 15,
  },
});

export default CoinDetails;

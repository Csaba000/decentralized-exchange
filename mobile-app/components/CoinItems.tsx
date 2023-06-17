import { useNavigation } from "@react-navigation/native";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import CoinDetails from "../pages/CoinDetails";
import { FC } from "react";
interface CoinItemsProps {
  coin: {
    id: string;
    image: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
  };
}

const CoinItems: FC<CoinItemsProps> = ({ coin }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("CoinDetails", { id: coin.id })}
    >
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: coin.image }} />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{coin.name}</Text>
              <Text style={styles.symbolText}>{coin.symbol.toUpperCase()}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>
                {coin.current_price.toFixed(2)}
              </Text>
              <Text style={styles.priceChangeText}>
                {coin.price_change_percentage_24h.toFixed(3)}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    backgroundColor: "white",
    width: 320,
    borderRadius: 10,
    margin: 10,
    height: 80,
  },
  rowContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    marginTop: 15,
  },
  image: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "75%",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
  },
  symbolText: {
    marginTop: 5,
    fontSize: 12,
    opacity: 0.5,
  },
  priceContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 8,
  },
  priceText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
  },
  priceChangeText: {
    marginTop: 5,
    fontSize: 12,
    opacity: 0.5,
    fontWeight: "600",
    textAlign: "right",
  },
});

export default CoinItems;

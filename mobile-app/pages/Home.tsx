import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
  FlatList,
} from "react-native";
import { Picker, onOpen } from "react-native-actions-sheet-picker";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import Liquidity from "./Liquidity";
import Swap from "./Swap";
import Header from "../components/Header";
import useCoinsApi from "../ui-logic/useCoinsApi";
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator";
import axios from "axios";

const Home = () => {
  const [coins, setCoins] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const get = async () => {
      await axios
        .get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        )
        .then((response) => {
          setCoins(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    get();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.flex}>
        <LoadingIndicator size={"large"} />
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <View
      style={{
        paddingLeft: 20,
        backgroundColor: "white",
        width: 320,
        borderRadius: 10,
        margin: 10,
        height: 80,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={{
            marginTop: 15,
          }}
        >
          <Image
            style={{ width: 50, height: 50 }}
            source={{ uri: item.image }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "75%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 12,
                opacity: 0.5,
              }}
            >
              {item.symbol.toUpperCase()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                marginTop: 5,
                fontSize: 16,
                fontWeight: "500",
                textAlign: "right",
              }}
            >
              {item.current_price.toFixed(2)}
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 12,
                opacity: 0.5,
                fontWeight: "600",
                textAlign: "right",
              }}
            >
              {item.price_change_percentage_24h.toFixed(3)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Dex" />
      <View style={styles.pageContainer}>
        <View style={styles.cardContainer}>
          <FlatList
            data={coins}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            pagingEnabled
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: "#grey",
    alignItems: "center",
    justifyContent: "center",
  },
  flex: {
    flex: 1,
  },
  pageContainer: {
    width: "100%",
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textInputs: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    fontSize: 18,
    width: "80%",
    height: 55,
    backgroundColor: "white",
    borderRadius: 50,
    marginBottom: 20,
    paddingLeft: 20,
  },
  cardContainer: {
    borderRadius: 8,
    height: 600,
    backgroundColor: "#333",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  disconnectButton: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: "80%",
    height: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderRadius: 50,
  },
  connectedText: {
    color: "black",
    fontSize: 20,
  },
  fromInput: {
    left: "10%",
    width: "100%",
  },
  fromToText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
  },
  dropdownButton: {
    marginTop: 20,
    width: "100%",
    borderRadius: 5,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownButtonText: {
    color: "black",
    textAlign: "center",
  },
  dropdownSearchInput: {
    borderWidth: 1,
    borderColor: "gray",
    height: 40,
  },
  selectContainer: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonHalf: {
    fontSize: 1,
    width: 120,
    borderRadius: 30,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownRowText: {
    fontSize: 18,
    color: "white",
    textAlignVertical: "center",
  },
  dropdownStyle: {
    backgroundColor: "#999",
    width: 200,
    height: 300,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "gray",
  },
});

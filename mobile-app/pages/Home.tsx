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
  // const { coins, loading } = useCoinsApi();

  // if (loading) {
  //   return (
  //     <View style={styles.flex}>
  //       <LoadingIndicator size={"large"} />
  //     </View>
  //   );
  // }

  const renderItem = ({ item }: any) => (
    <View
      style={{
        backgroundColor: "white",
        width: "95%",
        borderRadius: 20,
        margin: 20,
        height: 80,
      }}
    >
      <Text>{item.name}</Text>
      <Text>{item.symbol}</Text>
      <Text>{item.current_price}</Text>
      <Image style={{ width: 50, height: 50 }} source={{ uri: item.image }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Dex" />
      <View style={styles.pageContainer}>
        <View style={styles.cardContainer}>
          {/* <FlatList
            data={coins}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            // pagingEnabled
          /> */}
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
    borderRadius: 20,
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker, onOpen } from "react-native-actions-sheet-picker";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import useGetTokenData from "../ui-logic/useGetTokenData";

const Swap = () => {
  const { data, tokens, getTokenNames } = useGetTokenData();

  console.log();
  
  if (!data) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Swap</Text>
        </View>
        <View style={styles.textInputs}>
          <View style={styles.fromInput}>
            <SelectDropdown
              rowTextStyle={styles.dropdownRowText}
              disableAutoScroll={true}
              defaultButtonText={data[0].symbol}
              buttonStyle={styles.dropdownButtonHalf}
              buttonTextStyle={styles.dropdownButtonText}
              data={getTokenNames()}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              dropdownStyle={styles.dropdownStyle}
              renderDropdownIcon={() => {
                return (
                  <Icon
                    name="chevron-down-outline"
                    size={24}
                    color="black"
                    style={{ marginLeft: 10 }}
                  />
                );
              }}
            />

            <Text style={styles.fromToText}>From</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0.00"
              placeholderTextColor="grey"
            />
          </View>

          <View style={styles.fromInput}>
            <SelectDropdown
              rowTextStyle={styles.dropdownRowText}
              dropdownStyle={styles.dropdownStyle}
              disableAutoScroll={true}
              defaultButtonText={data[1].symbol}
              buttonStyle={styles.dropdownButtonHalf}
              buttonTextStyle={styles.dropdownButtonText}
              data={getTokenNames()}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              searchInputStyle={styles.dropdownSearchInput}
              renderDropdownIcon={() => {
                return (
                  <Icon
                    name="chevron-down-outline"
                    size={24}
                    color="black"
                    style={{ marginLeft: 10 }}
                  />
                );
              }}
            />
            <Text style={styles.fromToText}>To</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0.00"
              placeholderTextColor="grey"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={() => {
            alert("Hello");
          }}
        >
          <Text style={styles.connectedText}>Swap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Swap;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "grey",
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

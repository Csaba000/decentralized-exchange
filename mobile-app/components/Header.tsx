import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  navigation?: any;
};

const Header: React.FC<Props> = ({ navigation, title, iconName }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftHeader}>
        <Image
          source={require("../assets/Metamask-icon.png")}
          style={styles.profilePic}
        />
        <Text style={styles.taskText}>{title}</Text>
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.addIcon}>
          <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
            <Ionicons name={iconName} size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchIcon}>
          <TouchableOpacity onPress={() => alert("Search")}>
            <Ionicons name="ios-search" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: "8%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  addIcon: {
    marginRight: 20,
  },
  searchIcon: {
    marginRight: 0,
  },
  profilePic: {
    width: 40,
    height: 40,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  taskText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});

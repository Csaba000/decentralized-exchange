import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Swap from "../pages/Swap";
import Liquidity from "../pages/Liquidity";

const Tab = createBottomTabNavigator();

const HomeNav = createMaterialTopTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          backgroundColor: "#333",
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "white",
        tabBarLabelStyle: {
          color: "white",
        },
        tabBarInactiveBackgroundColor: "#333",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Trade"
        component={Swap}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="swap-horizontal" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;

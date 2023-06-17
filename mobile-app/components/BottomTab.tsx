import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import Swap from "../pages/Swap";
import Liquidity from "../pages/Liquidity";
import RemoveLiquidity from "../pages/RemoveLiqudity";
import CoinDetails from "../pages/CoinDetails";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="CoinDetails" component={CoinDetails} options={{
        headerTitle: "Coin Details",
      }}/>
    </Stack.Navigator>
  );
}

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
        component={StackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Swap"
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

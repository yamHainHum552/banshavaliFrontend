import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { COLORS, icons } from "../../../constants";

const TabIcon = ({ icon, color, name, focused }) => (
  <View style={styles.iconContainer}>
    <Image
      source={icon}
      tintColor={color}
      resizeMode="contain"
      style={styles.icon}
    />
    {/* <Text style={[styles.iconText, { color }, focused && styles.focusedText]}>
      {name}
    </Text> */}
  </View>
);

const TabsLayout = () => (
  <Tabs
    screenOptions={{
      tabBarShowLabel: false,
      headerShown: false,
      tabBarActiveTintColor: COLORS.light,
      tabBarInactiveTintColor: COLORS.secondaryLight,
      tabBarStyle: {
        backgroundColor: COLORS.background,
        overflow: "hidden",
        height: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: "Home",
        tabBarIcon: ({ color, focused }) => (
          <TabIcon
            icon={icons.home}
            color={color}
            // name="Home"
            focused={focused}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="search"
      options={{
        title: "Search",
        tabBarIcon: ({ color, focused }) => (
          <TabIcon
            icon={icons.search}
            color={color}
            // name="Home"
            focused={focused}
          />
        ),
      }}
    />

    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        tabBarIcon: ({ color, focused }) => (
          <TabIcon
            icon={icons.profile}
            color={color}
            // name="Profile"
            focused={focused}
          />
        ),
      }}
    />
  </Tabs>
);

const styles = StyleSheet.create({
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 24,
    width: 24,
  },
  iconText: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "font-pregular",
  },
  focusedText: {
    fontFamily: "font-psemibold",
  },
});

export default TabsLayout;

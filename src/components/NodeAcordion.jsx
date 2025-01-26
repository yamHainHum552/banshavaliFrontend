import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { COLORS } from "../constants"; // Replace this with your COLORS object

import AntDesign from "@expo/vector-icons/AntDesign";

const NodeAccordion = ({ node }) => {
  const parsedNode = JSON.parse(node); // Animated height for smooth open/close

  return (
    <TouchableOpacity style={styles.container}>
      {/* Accordion Header */}
      <Text style={styles.headerText}>{parsedNode.name}</Text>

      <AntDesign name="arrowright" size={10} color={COLORS.light} />
    </TouchableOpacity>
  );
};

export default NodeAccordion;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: "transparent",
    width: "100%",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    backgroundColor: COLORS.background,
    width: "100%",
  },

  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.light,
  },
  seeMore: {
    fontSize: 10,
    color: COLORS.primary,
  },
});

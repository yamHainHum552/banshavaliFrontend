import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { COLORS } from "../../constants";
import { router } from "expo-router";

const FamilyName = () => {
  const [familyName, setFamilyName] = useState("");
  const [placeOfOrigin, setPlaceOfOrigin] = useState("");

  const handleSubmit = () => {
    if (!familyName.trim()) {
      Alert.alert("Required", "Family Name is mandatory.");
      return;
    }

    router.replace("(root)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Setup Your Family Hierarchy</Text>

      {/* Family Name Input */}
      <Text style={styles.label}>Family Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your family name"
        value={familyName}
        onChangeText={setFamilyName}
      />

      {/* Place of Origin Input */}
      <Text style={styles.label}>Place of Origin</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the place of origin"
        value={placeOfOrigin}
        onChangeText={setPlaceOfOrigin}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default FamilyName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
});

import "react-native-get-random-values";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { API_KEY, COLORS, publicServer } from "../../constants";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../contexts/authProvider";
import CustomButton from "../../components/CustomButton";
import Toast from "react-native-toast-message";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const FamilyName = () => {
  const [familyName, setFamilyName] = useState("");
  const [placeOfOrigin, setPlaceOfOrigin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async () => {
    if (!familyName.trim()) {
      Alert.alert("Required", "Family Name is mandatory.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${publicServer}/api/registerHierarchy`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ familyName, placeOfOrigin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`
        );
      }

      Toast.show({
        text1: data.message,
        type: "success",
      });

      router.replace("/(root)/home");
    } catch (error) {
      console.error("Error submitting family hierarchy:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} />
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
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log("Place data:", data);
          console.log("Place details:", details);
          setPlaceOfOrigin(data.description);
        }}
        query={{
          key: API_KEY,
          language: "en",
        }}
        styles={{
          textInput: styles.input,
        }}
        debounce={200}
        enablePoweredByContainer={false}
        minLength={2}
        // returnKeyType={"search"}
      />

      {/* Submit Button */}
      <CustomButton
        title={isLoading ? "Getting Started" : "Get Started"}
        onPress={handleSubmit}
        style={styles.btn}
      />
    </View>
  );
};

export default FamilyName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
  btn: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});

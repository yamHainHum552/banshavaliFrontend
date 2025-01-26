import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../constants";
import { useLocalSearchParams } from "expo-router";

const EditInfo = () => {
  const { node } = useLocalSearchParams();
  const parsedNode = node ? JSON.parse(node) : null;

  const [name, setName] = useState(parsedNode?.name || "");
  const [isFemale, setIsFemale] = useState(parsedNode?.isFemale || false);
  const [isAlive, setIsAlive] = useState(parsedNode?.isAlive || true);
  const [occupation, setOccupation] = useState(parsedNode?.occupation || "");
  const [phone, setPhone] = useState(parsedNode?.contactInfo?.phone || "");
  const [email, setEmail] = useState(parsedNode?.contactInfo?.email || "");
  const [address, setAddress] = useState(parsedNode?.address || "");
  const [description, setDescription] = useState(parsedNode?.description || "");
  const [birthDate, setBirthDate] = useState(parsedNode?.birthDate || "");
  const [deathDate, setDeathDate] = useState(parsedNode?.deathDate || "");

  const handleSave = () => {
    console.log("Saved Data:", {
      name,
      isFemale,
      isAlive,
      occupation,
      contactInfo: { phone, email },
      address,
      description,
      birthDate,
      deathDate,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Node Information</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />

      {/* Is Female */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Is Female</Text>
        <Switch
          value={isFemale}
          onValueChange={setIsFemale}
          thumbColor={isFemale ? COLORS.primary : COLORS.border}
        />
      </View>

      {/* Is Alive */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Is Alive</Text>
        <Switch
          value={isAlive}
          onValueChange={setIsAlive}
          thumbColor={isAlive ? COLORS.primary : COLORS.border}
        />
      </View>

      {/* Occupation */}
      <Text style={styles.label}>Occupation</Text>
      <TextInput
        style={styles.input}
        value={occupation}
        onChangeText={setOccupation}
        placeholder="Enter occupation"
      />

      {/* Contact Info: Phone */}
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      {/* Contact Info: Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email address"
        keyboardType="email-address"
      />

      {/* Address */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        multiline
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />

      {/* Birth Date */}
      <Text style={styles.label}>Birth Date</Text>
      <TextInput
        style={styles.input}
        value={birthDate}
        onChangeText={setBirthDate}
        placeholder="Enter birth date"
      />

      {/* Death Date */}
      {!isAlive && (
        <>
          <Text style={styles.label}>Death Date</Text>
          <TextInput
            style={styles.input}
            value={deathDate}
            onChangeText={setDeathDate}
            placeholder="Enter death date"
          />
        </>
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditInfo;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.primary,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.text,
  },
  input: {
    height: 40,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: COLORS.light,
  },
  textArea: {
    height: 80,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: "bold",
  },
});

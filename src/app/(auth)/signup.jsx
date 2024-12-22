import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { COLORS, publicServer } from "../../constants";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { saveToken } from "../../store/token";
import { router } from "expo-router";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onSignUpPress = async () => {
    if (!form.username || !form.email || !form.password) {
      Toast.show({
        type: "error",
        text1: "Please don't leave the fields empty",
      });
      return;
    }

    try {
      const response = await fetch(`${publicServer}/api/registerUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: data.message || "Unable to signup.",
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Signup successful!",
      });
      router.push("/login");

      console.log("Response:", data);

      if (data.token) {
        await saveToken(data.token);
      }
    } catch (error) {
      console.error("Signup error:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} />
      <View style={styles.header}>
        {/* Add a background image or gradient for the header */}
        <Text style={styles.headerText}>Create Your Account</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Username"
          placeholderTextColor="#aaa"
          value={form.username}
          onChangeText={(value) => setForm({ ...form, username: value })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />

        <CustomButton
          title="Sign Up"
          onPress={onSignUpPress}
          style={styles.button}
        />

        <Link href="/login" style={styles.link}>
          Already have an account?{" "}
          <Text style={styles.linkHighlight}>Log In</Text>
        </Link>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 200,
    backgroundColor: COLORS.background,
    justifyContent: "flex-end",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "600",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  linkHighlight: {
    color: COLORS.background,
    fontWeight: "600",
  },
});

export default SignUp;

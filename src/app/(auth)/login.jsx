import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { COLORS, publicServer } from "../../constants";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/authProvider";

const Login = () => {
  const { saveAuthData } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const onLoginPress = async () => {
    if (!form.username || !form.password) {
      Toast.show({
        type: "error",
        text1: "Please don't leave the fields empty",
      });
      return;
    }

    try {
      const response = await fetch(`${publicServer}/api/loginUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: data.message || "Unable to login.",
        });
        return;
      }

      await saveAuthData(data.token, data.user);

      Toast.show({
        type: "success",
        text1: data.message,
      });
      if (data.user.isFirstLogin) router.replace("/screens/FamilyName");
      else router.replace("/(root)/home");
    } catch (error) {
      console.error("Login error:", error);
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
        <Text style={styles.headerText}>Login to Get Started</Text>
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
          title="Login"
          onPress={onLoginPress}
          style={styles.button}
        />

        <Link href="/(auth)/signup" style={styles.link}>
          Don't have an account?{" "}
          <Text style={styles.linkHighlight}>Signup</Text>
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

export default Login;

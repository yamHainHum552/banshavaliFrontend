import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { COLORS, publicServer } from "../../constants";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/authProvider";

const Login = () => {
  const { saveAuthData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const onLoginPress = async () => {
    if (!form.username || !form.password) {
      Toast.show({
        type: "error",
        text1: "Please don't leave the fields empty",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${publicServer}/api/loginUser`, {
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
    } finally {
      setLoading(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome Back!</Text>
        <Text style={styles.subHeaderText}>
          Log in to manage your family hierarchy
        </Text>
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
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Login"
          onPress={onLoginPress}
          style={styles.button}
          isLoading={loading}
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
    height: 250,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "700",
  },
  subHeaderText: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontWeight: "600",
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
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    paddingHorizontal: 8,
    position: "absolute",
    right: 0,
    top: "20%",
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

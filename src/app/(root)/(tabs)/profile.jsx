import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, icons } from "../../../constants";
import { useAuth } from "../../../contexts/authProvider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const Profile = () => {
  const { user, clearAuthData } = useAuth();

  const handleEditProfile = () => {
    console.log("Edit Profile Pressed");
  };

  const handleLogout = async () => {
    try {
      await clearAuthData();
      Toast.show({
        text1: "Logout Successful",
        type: "success",
      });
      router.replace("/(auth)/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} />
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={icons.person} tintColor="white" resizeMethod="contain" />
        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userPhone}>{user.phone}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" color="white" size={30} />
        </TouchableOpacity>
      </View>

      {/* Additional Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>App Features</Text>
        <TouchableOpacity style={styles.featureButton}>
          <Text style={styles.featureText}>View Family Hierarchy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Text style={styles.featureText}>Add New Member</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Text style={styles.featureText}>Update Place of Origin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: COLORS.background,
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.light,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.light,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.secondaryLight,
    marginTop: 4,
  },
  userPhone: {
    fontSize: 16,
    color: COLORS.secondaryLight,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    width: "40%",
  },
  actionIcon: {
    height: 20,
    width: 20,
    marginBottom: 5,
    tintColor: COLORS.light,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.light,
  },
  featuresContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.background,
    marginBottom: 10,
  },
  featureButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderColor: COLORS.background,
    borderWidth: 1,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.background,
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

export default Profile;

import * as SecureStore from "expo-secure-store";

// Save token
const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync("authToken", token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Retrieve token
const getToken = async () => {
  try {
    return await SecureStore.getItemAsync("authToken");
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// Remove token (on logout)
const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync("authToken");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};
export { saveToken, removeToken, getToken };

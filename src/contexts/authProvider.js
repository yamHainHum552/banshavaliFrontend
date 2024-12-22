import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveAuthData = async (newToken, userInfo) => {
    try {
      await SecureStore.setItemAsync("authToken", newToken);
      await SecureStore.setItemAsync("authUser", JSON.stringify(userInfo));
      setToken(newToken);
      setUser(userInfo);
    } catch (error) {
      console.error("Error saving auth data:", error);
    }
  };

  const loadAuthData = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("authToken");
      const storedUser = await SecureStore.getItemAsync("authUser");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = async () => {
    try {
      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("authUser");
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        saveAuthData,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

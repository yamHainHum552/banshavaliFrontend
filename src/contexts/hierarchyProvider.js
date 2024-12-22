import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";

export const HierarchyContext = createContext();

export const HierarchyProvider = ({ children }) => {
  const [hierarchyInf, setHierarchyInf] = useState(null);

  const [loading, setLoading] = useState(true);

  const saveHierarchyData = async (data) => {
    try {
      const stringifiedData = JSON.stringify(data);
      await SecureStore.setItemAsync("hierarchyData", stringifiedData);
      setHierarchyInf(stringifiedData);
    } catch (error) {
      console.error("Error saving hierarchy data:", error);
    }
  };

  const loadHierarchyData = async () => {
    try {
      const storedHierarchyData = await SecureStore.getItemAsync(
        "hierarchyData"
      );

      if (storedHierarchyData) {
        setHierarchyInf(JSON.parse(storedHierarchyData));
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearHierarchyData = async () => {
    try {
      await SecureStore.deleteItemAsync("hierarchyData");

      setHierarchyInf(null);
    } catch (error) {
      console.error("Error clearing Hierarchy data:", error);
    }
  };

  useEffect(() => {
    loadHierarchyData();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <HierarchyContext.Provider
      value={{
        hierarchyInf,
        clearHierarchyData,
        saveHierarchyData,
      }}
    >
      {children}
    </HierarchyContext.Provider>
  );
};

export const useHierarchy = () => useContext(HierarchyContext);

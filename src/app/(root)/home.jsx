import { View, Text, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authProvider";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FamilyTree from "../../components/Node";
import { publicServer } from "../../constants";
import { buildTree } from "../../utils";
import { useHierarchy } from "../../contexts/hierarchyProvider";

const Home = () => {
  const { user, clearAuthData, token } = useAuth();
  const [hierarchcalData, setHierarchicalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { saveHierarchyData, hierarchyInf } = useHierarchy();

  const onPress = async () => {
    try {
      await clearAuthData();
      Toast.show({
        text1: "Logout Successfull",
        type: "success",
      });
      router.replace("/(auth)/login");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let response = await fetch(
        `${publicServer}/api/hierarchy/6760100e6c4755a928066bb4/user/67600a2c0fbaf64bbebf7591/family`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();
      setHierarchicalData(buildTree(data.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    try {
      let response = await fetch(
        `${publicServer}/api/getHierarchy/6760100e6c4755a928066bb4`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      response = await response.json();
      saveHierarchyData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <View className="flex flex-row items-center justify-between">
        <Text style={{ color: "blue" }}>Home</Text>
        <TouchableOpacity onPress={onPress}>
          <Text className="text-red-500">Logout</Text>
        </TouchableOpacity>
      </View>

      {!loading && <FamilyTree data={hierarchcalData} />}
    </>
  );
};

export default Home;

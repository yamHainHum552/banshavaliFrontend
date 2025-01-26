import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../contexts/authProvider";
import FamilyTree from "../../../components/Node";
import { COLORS, publicServer } from "../../../constants";
import { buildTree } from "../../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ReusableModal from "../../../components/Modal";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import HomeSkeleton from "../../../components/skeletons/HomeSkeleton";

const Home = () => {
  const { user, token } = useAuth();
  const [hierarchicalData, setHierarchicalData] = useState([]);
  const [hierarchyInf, setHierarchyInf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  // Ref to track if the data has already been fetched
  const dataFetchedRef = useRef(false);
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const fetchFamilyData = async (hierarchyId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${publicServer}/api/hierarchy/${hierarchyId}/user/${user.id}/family`,
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
      const data = await response.json();
      setHierarchicalData(buildTree(data.data));
    } catch (error) {
      console.error("Error fetching family data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHierarchyInformation = async () => {
    try {
      const response = await fetch(`${publicServer}/api/getHierarchy`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setHierarchyInf(data.hierarchy);

      if (data.hierarchy?._id) {
        fetchFamilyData(data.hierarchy._id);
      }
    } catch (error) {
      console.error("Error fetching hierarchy information:", error);
      router.navigate("/screens/FamilyName");
    }
  };

  useEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      fetchHierarchyInformation();
    }
  }, []);

  const handleAddFirstMember = async (formData) => {
    try {
      const response = await fetch(`${publicServer}/api/registerFirstMember`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          hierarchyId: hierarchyInf._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();

      Toast.show({ text1: data.message, type: "success" });
    } catch (error) {
      Toast.show({ text1: "Error Adding First Member.", type: "error" });
      console.log(error);
    } finally {
      fetchHierarchyInformation();
    }
  };

  const handleOpenModal = () => {
    let title, onSubmit, placeholder;

    title = "Add First Member";
    onSubmit = handleAddFirstMember;
    placeholder = { name: "Member Name", age: "Parent Age" };

    setModalConfig({ title, onSubmit, placeholder });
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} />
      {loading ? (
        <Home />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <Text style={styles.familyNameText}>
                {hierarchyInf.familyName || "Family Name"}
              </Text>
              <Text style={styles.originText}>
                Place of Origin: {hierarchyInf.placeOfOrigin || "Not Specified"}
              </Text>
            </View>
          </View>

          {hierarchicalData.length > 0 ? (
            <FamilyTree
              data={hierarchicalData}
              currentNodeId={hierarchicalData[0]._id}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No family members found. Start your family tree by adding a
                member!
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleOpenModal}
              >
                <Text style={styles.addButtonText}>Add First Member</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {isModalVisible && (
        <ReusableModal
          title={modalConfig.title}
          onClose={handleCloseModal}
          onSubmit={modalConfig.onSubmit}
          placeholder={modalConfig.placeholder}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: "column",
  },
  familyNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.light,
    marginBottom: 4,
  },
  originText: {
    fontSize: 14,
    color: COLORS.secondaryLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.secondaryDark,
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;

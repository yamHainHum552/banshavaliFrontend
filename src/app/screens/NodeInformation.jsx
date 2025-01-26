import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { COLORS, icons } from "../../constants";
import ReusableModal from "../../components/Modal";
import { useAuth } from "../../contexts/authProvider";
import Entypo from "@expo/vector-icons/Entypo";
import {
  handleChildSubmit,
  handleDeleteNode,
  handleParentSubmit,
  handleSiblingSubmit,
} from "../../services";

const NodeInformation = () => {
  const { node } = useLocalSearchParams();
  const parsedNode = node ? JSON.parse(node) : null;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const { token } = useAuth();

  const handleCloseModal = () => setIsModalVisible(false);
  const toggleOptions = () => setIsOptionsVisible(!isOptionsVisible);

  const handleOpenModal = (type) => {
    let title, onSubmit, placeholder;

    switch (type) {
      case "parent":
        title = "Add Parent";
        onSubmit = handleParentSubmit;
        placeholder = { name: "Parent Name", age: "Parent Age" };
        break;
      case "sibling":
        title = "Add Sibling";

        onSubmit = handleSiblingSubmit;
        placeholder = { name: "Sibling Name", age: "Sibling Age" };
        break;
      case "child":
        title = "Add Child";

        onSubmit = handleChildSubmit;
        placeholder = { name: "Child Name", age: "Child Age" };
        break;

      default:
        return;
    }

    setModalConfig({ title, onSubmit, placeholder });
    setIsModalVisible(true);
  };

  const renderChildren = (children) => (
    <FlatList
      data={children}
      keyExtractor={(item, index) => `${item.id || index}`}
      renderItem={({ item }) => (
        <View style={styles.childCard}>
          <Text style={styles.childName}>Name: {item.name}</Text>
          <Text style={styles.childDetails}>Age: {item.age}</Text>
        </View>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.childrenList}
    />
  );

  const Options = () => (
    <Modal
      transparent
      visible={isOptionsVisible}
      onRequestClose={toggleOptions}
      animationType="fade"
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={toggleOptions}
        activeOpacity={1}
      >
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              router.push({
                pathname: "/screens/EditInfo",
                params: { node: node },
              });
            }}
          >
            <Text style={styles.optionText}>Edit Node</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleDeleteNode(parsedNode, token)}
          >
            <Text style={styles.optionText}>Delete Node</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backArrowContainer}
            onPress={() => router.back()}
          >
            <Image source={icons.backArrow} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {parsedNode?.name || "Node Information"}
          </Text>
          <TouchableOpacity style={styles.menuButton} onPress={toggleOptions}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Options Menu */}
        {isOptionsVisible && <Options />}

        {/* Node Details */}
        {parsedNode ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Name:</Text> {parsedNode.name}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Age:</Text> {parsedNode.age}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Gender:</Text>{" "}
                {parsedNode.isFemale ? "Female" : "Male" || "Not specified"}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Relation:</Text>{" "}
                {parsedNode.relation || "Not specified"}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Children</Text>
              {parsedNode.children && parsedNode.children.length > 0 ? (
                renderChildren(parsedNode.children)
              ) : (
                <Text style={styles.infoText}>No children available</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Details</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Occupation:</Text>{" "}
                {parsedNode.occupation || "Not specified"}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Location:</Text>{" "}
                {parsedNode.location || "Not specified"}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Contact:</Text>{" "}
                {parsedNode.contact || "Not specified"}
              </Text>
            </View>

            {/* Actions */}
            {!parsedNode.isFemale && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleOpenModal("child")}
                >
                  <Text style={styles.actionButtonText}>Add Child</Text>
                </TouchableOpacity>
                {!parsedNode.parent ? (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenModal("parent")}
                  >
                    <Text style={styles.actionButtonText}>Add Parent</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenModal("sibling")}
                  >
                    <Text style={styles.actionButtonText}>Add Sibling</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.noData}>
            <Text style={styles.infoText}>No node data available</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal for Adding Sibling */}
      {isModalVisible && (
        <ReusableModal
          title={modalConfig.title}
          onClose={handleCloseModal}
          onSubmit={modalConfig.onSubmit}
          placeholder={modalConfig.placeholder}
          parsedNode={parsedNode}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", color: COLORS.dark },
  menuButton: { padding: 8 },
  backArrowContainer: { padding: 8 },
  backArrow: { height: 20, width: 20 },
  section: {
    marginBottom: 10,
    padding: 16,
    backgroundColor: COLORS.light,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.dark,
  },
  infoText: { fontSize: 16, marginVertical: 4, color: COLORS.dark },
  infoLabel: { fontWeight: "bold" },
  childCard: {
    margin: 8,
    padding: 12,
    backgroundColor: COLORS.light,
    borderRadius: 10,
  },
  childName: { fontSize: 16, fontWeight: "bold", color: COLORS.dark },
  childDetails: { fontSize: 14, color: COLORS.dark },
  actions: { marginTop: 20 },
  actionButton: {
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  actionButtonText: { color: COLORS.light, fontWeight: "bold", fontSize: 16 },
  noData: { justifyContent: "center", alignItems: "center", marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    top: 5,
    right: 0,
    width: 200,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  optionButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { fontSize: 16, color: COLORS.dark, alignContent: "center" },
});

export default NodeInformation;

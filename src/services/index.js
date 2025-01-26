import { Alert } from "react-native";
import { publicServer } from "../constants";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export const handleSiblingSubmit = async (formData, parsedNode, token) => {
  try {
    const response = await fetch(`${publicServer}/api/registerSibling`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        hierarchyId: parsedNode.hierarchyId,
        siblingId: parsedNode._id,
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
    Toast.show({ text1: "Error adding sibling.", type: "error" });
  }
};

export const handleParentSubmit = async (formData, parsedNode, token) => {
  try {
    const response = await fetch(`${publicServer}/api/registerParent`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        hierarchyId: parsedNode.hierarchyId,
        childIds: [parsedNode._id],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const responseData = await response.json();

    Toast.show({ text1: responseData.message, type: "success" });
  } catch (error) {
    console.error("Error registering parent:", error.message);
    Toast.show({ text1: "Error adding Parent.", type: "error" });
  }
};
export const handleChildSubmit = async (formData, parsedNode, token) => {
  try {
    const response = await fetch(`${publicServer}/api/registerChild`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        hierarchyId: parsedNode.hierarchyId,
        parentId: parsedNode._id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const responseData = await response.json();

    Toast.show({ text1: responseData.message, type: "success" });
  } catch (error) {
    console.error("Error registering Child:", error.message);
    Toast.show({ text1: "Error adding Child.", type: "error" });
  }
};
export const handleDeleteNode = async (parsedNode, token) => {
  Alert.alert("Delete Node", "Are you sure you want to delete this node?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          const response = await fetch(
            `${publicServer}/api/family-member/${parsedNode._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `HTTP error! Status: ${response.status}`
            );
          }

          const data = await response.json();

          Toast.show({ text1: data.message, type: "success" });
          router.replace("/screens/FamilyTree");
          router.back();
        } catch (error) {
          Toast.show({ text1: "Error deleting node.", type: "error" });
        }
      },
    },
  ]);
};

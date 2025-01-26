import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { useAuth } from "../../../contexts/authProvider";
import { buildTree } from "../../../utils";
import { COLORS, publicServer } from "../../../constants";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchSkeleton from "../../../components/skeletons/SearchSkeleton";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const { user, token } = useAuth();
  const [hierarchicalData, setHierarchicalData] = useState(null);
  const [hierarchyInf, setHierarchyInf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dataFetchedRef = useRef(false);

  // Fetch family data by hierarchy ID
  const fetchFamilyData = async (hierarchyId) => {
    try {
      setLoading(true);
      setError("");
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
      setError("Failed to fetch family data. Please try again later.");
      console.error("Error fetching family data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hierarchy information
  const fetchHierarchyInformation = async () => {
    try {
      setError("");
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
      } else {
        setError("No hierarchy information found.");
      }
    } catch (error) {
      setError("Failed to fetch hierarchy information. Please try again.");
      console.error("Error fetching hierarchy information:", error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      fetchHierarchyInformation();
    }
  }, []);

  // Depth-first search for family members
  const dfsSearch = (node, query) => {
    if (!node) return [];

    const stack = Array.isArray(node) ? [...node] : [node];
    const foundNodes = [];

    while (stack.length > 0) {
      const currentNode = stack.pop();

      if (currentNode?.name?.toLowerCase().includes(query.toLowerCase())) {
        foundNodes.push(currentNode);
      }

      if (currentNode?.children) {
        stack.push(...currentNode.children);
      }
    }

    return foundNodes;
  };

  // Handle search action
  const handleSearch = () => {
    if (!hierarchicalData) {
      Alert.alert("Error", "No family data available to search.");
      return;
    }

    const foundNodes = dfsSearch(hierarchicalData, searchQuery);
    setResults(foundNodes);
  };

  // Handle result item click
  const handleResultClick = (node) => {
    router.push({
      pathname: "/screens/NodeInformation",
      params: { node: JSON.stringify(node) },
    });
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultClick(item)}
    >
      <Text style={styles.resultName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.back} />

      {loading ? (
        <SearchSkeleton />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <Text style={styles.familyNameText}>Search Family Tree</Text>
              <Text style={styles.originText}>Find family members easily</Text>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a family member"
              placeholderTextColor={COLORS.secondaryLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item) => item._id}
              renderItem={renderResultItem}
              contentContainerStyle={styles.resultsContainer}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  searchButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  resultItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: COLORS.light,
    borderRadius: 6,
    elevation: 2,
  },
  resultName: {
    fontSize: 16,
    color: COLORS.text,
  },
  noResultText: {
    marginTop: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Search;

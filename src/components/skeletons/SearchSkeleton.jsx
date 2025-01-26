import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { COLORS } from "../../constants";

const SearchSkeleton = () => {
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shineAnim]);

  const shineStyle = {
    opacity: shineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.headerSkeletonContainer}>
        <View style={styles.headerLeftSkeleton}>
          <Animated.View style={[styles.familyNameSkeleton, shineStyle]} />
          <Animated.View style={[styles.originSkeleton, shineStyle]} />
        </View>
      </View>
      <View style={styles.searchContainer}>
        {/* <TextInput
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
              </TouchableOpacity> */}
        <Animated.View style={[styles.familyNameSkeleton, shineStyle]} />
        <Animated.View style={[styles.originSkeleton, shineStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSkeletonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
    marginBottom: 20,
  },
  headerLeftSkeleton: {
    flexDirection: "column",
    width: "60%",
  },
  familyNameSkeleton: {
    width: "70%",
    height: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
  },
  originSkeleton: {
    width: "50%",
    height: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    elevation: 2,
  },
});

export default SearchSkeleton;

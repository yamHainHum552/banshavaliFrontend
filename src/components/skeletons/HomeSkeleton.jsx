import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { COLORS } from "../../constants";

const HomeSkeleton = () => {
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
});

export default HomeSkeleton;

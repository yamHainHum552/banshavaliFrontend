import React, { useRef, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Circle, Line, Text as SvgText } from "react-native-svg";
import { COLORS } from "../constants";
import {
  useSharedValue,
  withTiming,
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ZoomableSvg from "../components/ZoomableSVG";
import NodeAccordion from "./NodeAcordion";
import { router } from "expo-router";

import { TouchableWithoutFeedback } from "react-native-gesture-handler";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const screenWidth = Dimensions.get("window").width / 2;
const screenHeight = Dimensions.get("window").height / 2;

const levelNumbers = {};

const calculateTreeLayout = (node, x, y, spacingX, spacingY, level = 0) => {
  let totalWidth = 0;
  const childLayouts = [];

  node.children.forEach((child) => {
    const childLayout = calculateTreeLayout(
      child,
      x + totalWidth,
      y + spacingY,
      spacingX,
      spacingY,
      level + 1
    );
    totalWidth += childLayout.width + spacingX;
    childLayouts.push(childLayout);
  });

  const subtreeWidth = totalWidth || spacingX;
  const centerX = x + subtreeWidth / 2;

  return {
    node,
    x: centerX,
    y,
    width: subtreeWidth,
    level,
    children: childLayouts,
  };
};

const renderTree = (
  layout,
  currentNodeId,
  blinkingOpacity,
  activeAccordionId,
  setActiveAccordionId
) => {
  const { node, x, y, level, children } = layout;

  if (!levelNumbers[level]) {
    levelNumbers[level] = Object.keys(levelNumbers).length + 1;
  }

  const isCurrentNode = node._id === currentNodeId;
  const isAccordionOpen = activeAccordionId === node._id;

  return (
    <React.Fragment key={node._id}>
      {children.map((child) => (
        <Line
          key={`${node._id}-${child.node._id}`}
          x1={x}
          y1={y}
          x2={child.x}
          y2={child.y}
          stroke={COLORS.background}
          strokeWidth={2}
        />
      ))}

      <Circle
        cx={x}
        cy={y}
        r={10}
        fill={COLORS.background}
        opacity={isCurrentNode ? blinkingOpacity.value : 1}
        onPress={() => {
          setActiveAccordionId(isAccordionOpen ? null : node._id);
        }}
      />

      {isAccordionOpen && (
        <TouchableWithoutFeedback
          onPress={() => {
            router.push({
              pathname: "/screens/NodeInformation",
              params: { node: JSON.stringify(node) },
            });
          }}
          style={[styles.accordionContainer, { top: y - 42, left: x - 85 }]}
        >
          <View style={styles.triangle} />
          <NodeAccordion node={JSON.stringify(node)} />
        </TouchableWithoutFeedback>
      )}

      <SvgText x={x} y={y + 5} textAnchor="middle" fontSize="12" fill="#fff">
        {levelNumbers[level]}
      </SvgText>

      {children.map((child) =>
        renderTree(
          child,
          currentNodeId,
          blinkingOpacity,
          activeAccordionId,
          setActiveAccordionId
        )
      )}
    </React.Fragment>
  );
};

const FamilyTree = ({ data, currentNodeId }) => {
  const scale = useSharedValue(1);
  const spacingX = 15;
  const spacingY = 30;
  const scrollViewRefX = useRef(null);
  const scrollViewRefY = useRef(null);
  const blinkingOpacity = useSharedValue(1);
  const [activeAccordionId, setActiveAccordionId] = useState(null);

  for (const key in levelNumbers) delete levelNumbers[key];

  const treeLayout = data.map((rootNode) =>
    calculateTreeLayout(
      rootNode,
      screenWidth - data.length,
      screenHeight,
      spacingX,
      spacingY
    )
  );

  useEffect(() => {
    blinkingOpacity.value = withTiming(0, { duration: 500 }, (finished) => {
      if (finished) {
        blinkingOpacity.value = withTiming(1, { duration: 500 });
      }
    });
  }, [currentNodeId]);

  const findNodePosition = (layout, nodeId) => {
    if (layout.node._id === nodeId) {
      return { x: layout.x, y: layout.y };
    }
    for (const child of layout.children) {
      const position = findNodePosition(child, nodeId);
      if (position) return position;
    }
    return null;
  };

  const handleCurrentLocation = () => {
    const nodePosition = treeLayout
      .map((rootLayout) => findNodePosition(rootLayout, currentNodeId))
      .find((pos) => pos !== null);

    if (nodePosition) {
      scale.value = withTiming(2, { duration: 400 });
      scrollViewRefX.current?.scrollTo({
        x: Math.max(0, nodePosition.x - screenWidth / (2 * scale.value)),
        animated: true,
      });
      scrollViewRefY.current?.scrollTo({
        y: Math.max(0, nodePosition.y - screenHeight / (2 * scale.value)),
        animated: true,
      });
    }
  };

  return (
    <>
      <View style={styles.zoomControls}>
        <TouchableOpacity
          onPress={() => {
            scale.value = Math.min(5, scale.value + 0.2);
          }}
        >
          <Entypo name="circle-with-plus" color={COLORS.light} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            scale.value = Math.max(0.1, scale.value - 0.2);
          }}
        >
          <Entypo name="circle-with-minus" color={COLORS.light} size={30} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleCurrentLocation}
      >
        <FontAwesome6
          name="location-crosshairs"
          size={24}
          color={COLORS.light}
        />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => setActiveAccordionId(null)}>
        <ScrollView
          ref={scrollViewRefX}
          horizontal
          contentContainerStyle={styles.scrollContent}
        >
          <ScrollView
            ref={scrollViewRefY}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={{ flex: 1 }} pointerEvents="box-none">
              <ZoomableSvg scale={scale}>
                {treeLayout.map((rootLayout) =>
                  renderTree(
                    rootLayout,
                    currentNodeId,
                    blinkingOpacity,
                    activeAccordionId,
                    setActiveAccordionId
                  )
                )}
              </ZoomableSvg>
            </View>
          </ScrollView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  zoomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    gap: 5,
    position: "absolute",
    zIndex: 1,
    right: 5,
    top: 50,
  },
  locationButton: {
    position: "absolute",
    zIndex: 1,
    right: 5,
    bottom: 5,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    minWidth: 1000,
    minHeight: 1000,
  },
  accordionContainer: {
    position: "relative",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 5,
    maxWidth: 180,
    alignItems: "center",
    zIndex: -10,
    elevation: 10,
  },
  triangle: {
    position: "absolute",
    bottom: -10,
    left: "50%",
    transform: [{ translateX: -5 }],
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: COLORS.background,
  },
});

export default FamilyTree;

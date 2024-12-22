import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import ZoomableSvg from "../components/ZoomableSVG";
import { Circle, Line, Text as SvgText } from "react-native-svg";
import { COLORS } from "../constants";

const screenWidth = Dimensions.get("window").width / 2;
const screenHeight = Dimensions.get("window").height / 2;

const levelNumbers = {}; // Object to store the number for each level

const calculateTreeLayout = (node, x, y, spacingX, spacingY, level = 0) => {
  let nodeX = x;

  const childrenPositions = node.children.map((child, index) => {
    const childX = nodeX + spacingX * index;
    const childY = y + spacingY;
    const result = calculateTreeLayout(
      child,
      childX,
      childY,
      spacingX,
      spacingY,
      level + 1
    );
    nodeX += result.width;
    return result;
  });

  const nodeWidth =
    childrenPositions.length > 0
      ? childrenPositions.reduce((sum, child) => sum + child.width, 0)
      : spacingX;

  const nodeCenterX =
    childrenPositions.length > 0
      ? (childrenPositions[0].x +
          childrenPositions[childrenPositions.length - 1].x) /
        2
      : x;

  return {
    node,
    x: nodeCenterX,
    y,
    width: nodeWidth,
    level,
    children: childrenPositions,
  };
};

const renderTree = (layout) => {
  const { node, x, y, level, children } = layout;

  // Assign a number to this level if not already assigned
  if (!levelNumbers[level]) {
    levelNumbers[level] = Object.keys(levelNumbers).length + 1;
  }

  const levelNumber = levelNumbers[level];

  return (
    <React.Fragment key={node._id}>
      {children.map((child) => (
        <Line
          key={`${node._id}-${child.node._id}`}
          x1={x}
          y1={y}
          x2={child.x}
          y2={child.y}
          stroke="black"
          strokeWidth={2}
        />
      ))}

      {/* Node Circle */}
      <Circle
        cx={x}
        cy={y}
        r={20}
        fill={COLORS.background}
        onPress={() => console.log(`Node: ${node.name}`)}
      />
      <SvgText x={x} y={y + 5} textAnchor="middle" fontSize="12" fill="#fff">
        {levelNumber}
      </SvgText>

      {/* Render Children */}
      {children.map((child) => renderTree(child))}
    </React.Fragment>
  );
};

const FamilyTree = ({ data }) => {
  const spacingX = 70;
  const spacingY = 70;

  // Clear level numbers on every render
  for (const key in levelNumbers) delete levelNumbers[key];

  // Build hierarchical layout
  const treeLayout = data.map((rootNode) =>
    calculateTreeLayout(rootNode, screenWidth, screenHeight, spacingX, spacingY)
  );

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        flexGrow: 1,
        minWidth: 2000,
      }}
    >
      <View style={{ flex: 1 }}>
        <ZoomableSvg>
          {treeLayout.map((rootLayout) => renderTree(rootLayout))}
        </ZoomableSvg>
      </View>
    </ScrollView>
  );
};

export default FamilyTree;
